import React from 'react';
import { Text, View, StyleSheet, Linking } from 'react-native';
import { Image } from 'expo-image';

interface HtmlRendererProps {
  html: string;
  baseFontSize?: number;
}

interface ASTNode {
  type: 'text' | 'element';
  tag?: string;
  text?: string;
  children?: ASTNode[];
  attrs?: Record<string, string>;
}

// Clean unwanted scraper / AI reference tags
const cleanHtml = (raw: string): string => {
  if (!raw) return '';
  return raw
    .replace(/<source-footnote[\s\S]*?<\/source-footnote>/gi, '')
    .replace(/<sources-carousel-inline[\s\S]*?<\/sources-carousel-inline>/gi, '')
    .replace(/<source-inline-chip[\s\S]*?<\/source-inline-chip>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

// Helper to parse HTML tag attributes (src, href, alt, style, etc.)
const parseAttributes = (attrStr?: string): Record<string, string> => {
  if (!attrStr) return {};
  const attrs: Record<string, string> = {};
  const attrRegex = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(attrStr)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attrs[name] = value;
  }
  return attrs;
};

// Tokenizer & Parser for simple HTML
const parseHtmlToAST = (htmlString: string): ASTNode[] => {
  const sanitized = cleanHtml(htmlString);
  const stack: ASTNode[] = [{ type: 'element', tag: 'root', children: [] }];

  // Regex to match tags or text
  const tagRegex = /<(\/)?([a-zA-Z0-9-]+)([^>]*)>|([^<]+)/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(sanitized)) !== null) {
    const [_, isClose, tagName, attrStr, textContent] = match;

    if (textContent) {
      const parent = stack[stack.length - 1];
      if (parent && parent.children) {
        parent.children.push({
          type: 'text',
          text: textContent,
        });
      }
    } else if (tagName) {
      const lowerTag = tagName.toLowerCase();
      const isSelfClosing = ['br', 'hr', 'img', 'input', 'meta'].includes(lowerTag);

      if (isClose) {
        // Pop stack until matching tag
        for (let i = stack.length - 1; i > 0; i--) {
          if (stack[i].tag === lowerTag) {
            stack.splice(i);
            break;
          }
        }
      } else {
        const newNode: ASTNode = {
          type: 'element',
          tag: lowerTag,
          attrs: parseAttributes(attrStr),
          children: [],
        };

        const parent = stack[stack.length - 1];
        if (parent && parent.children) {
          parent.children.push(newNode);
        }

        if (!isSelfClosing) {
          stack.push(newNode);
        }
      }
    }
  }

  return stack[0]?.children || [];
};

export const HtmlRenderer: React.FC<HtmlRendererProps> = ({ html, baseFontSize = 18 }) => {
  const nodes = parseHtmlToAST(html);

  const renderInlineNode = (node: ASTNode, index: number, inheritStyle: any = {}): React.ReactNode => {
    if (node.type === 'text') {
      if (!node.text) return null;
      return (
        <Text key={index} style={inheritStyle}>
          {node.text}
        </Text>
      );
    }

    const tag = node.tag;
    let style = { ...inheritStyle };

    if (tag === 'b' || tag === 'strong') {
      style.fontWeight = '700';
      style.color = '#111827';
    } else if (tag === 'i' || tag === 'em') {
      style.fontStyle = 'italic';
    } else if (tag === 'u') {
      style.textDecorationLine = 'underline';
    } else if (tag === 'a') {
      style.color = '#8B0000';
      style.textDecorationLine = 'underline';
    }

    const children = node.children?.map((child, idx) => renderInlineNode(child, idx, style));

    if (tag === 'a' && node.attrs?.href) {
      return (
        <Text
          key={index}
          style={style}
          onPress={() => Linking.openURL(node.attrs!.href).catch(() => {})}
        >
          {children}
        </Text>
      );
    }

    return (
      <Text key={index} style={style}>
        {children}
      </Text>
    );
  };

  const renderBlockNode = (node: ASTNode, index: number): React.ReactNode => {
    if (node.type === 'text') {
      const trimmed = node.text?.trim();
      if (!trimmed) return null;
      return (
        <Text key={index} style={[styles.paragraphText, { fontSize: baseFontSize, lineHeight: Math.round(baseFontSize * 1.55) }]}>
          {node.text}
        </Text>
      );
    }

    const tag = node.tag;

    // Line breaks & dividers
    if (tag === 'br') {
      return <View key={index} style={{ height: 6 }} />;
    }
    if (tag === 'hr') {
      return <View key={index} style={styles.hr} />;
    }

    // Images
    if (tag === 'img') {
      const rawSrc = node.attrs?.src;
      if (!rawSrc) return null;

      let imageUri = rawSrc.trim();
      if (imageUri.startsWith('//')) {
        imageUri = `https:${imageUri}`;
      } else if (imageUri.startsWith('/') && !imageUri.startsWith('http')) {
        imageUri = `http://192.168.1.9:5000${imageUri}`;
      }

      const altText = node.attrs?.alt || node.attrs?.title || '';

      return (
        <View key={index} style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.inlineImage}
            contentFit="cover"
            transition={300}
          />
          {altText ? <Text style={styles.imageCaption}>{altText}</Text> : null}
        </View>
      );
    }

    // Headings
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
      const scale = tag === 'h1' ? 1.45 : tag === 'h2' ? 1.35 : tag === 'h3' ? 1.25 : 1.15;
      const headingFontSize = Math.round(baseFontSize * scale);
      return (
        <View key={index} style={styles.headingContainer}>
          <Text style={[styles.headingText, { fontSize: headingFontSize, lineHeight: Math.round(headingFontSize * 1.35) }]}>
            {node.children?.map((child, idx) => renderInlineNode(child, idx, { fontWeight: '700', color: '#111827' }))}
          </Text>
        </View>
      );
    }

    // Unordered & Ordered Lists
    if (tag === 'ul' || tag === 'ol') {
      return (
        <View key={index} style={styles.listContainer}>
          {node.children?.map((child, idx) => {
            if (child.type === 'element' && child.tag === 'li') {
              const bullet = tag === 'ol' ? `${idx + 1}. ` : '• ';
              return (
                <View key={idx} style={styles.listItemRow}>
                  <Text style={[styles.bulletText, { fontSize: baseFontSize }]}>{bullet}</Text>
                  <Text style={[styles.listItemText, { fontSize: baseFontSize, lineHeight: Math.round(baseFontSize * 1.5) }]}>
                    {child.children?.map((c, i) => renderInlineNode(c, i, {}))}
                  </Text>
                </View>
              );
            }
            return renderBlockNode(child, idx);
          })}
        </View>
      );
    }

    // Paragraphs & Div containers
    if (tag === 'p' || tag === 'div' || tag === 'root' || tag === 'font') {
      // Check if block node contains nested block elements (like h1, ul, p, img)
      const hasBlockChildren = node.children?.some(
        (c) => c.type === 'element' && ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'hr', 'img'].includes(c.tag || '')
      );

      if (hasBlockChildren) {
        return (
          <View key={index} style={styles.blockContainer}>
            {node.children?.map((child, idx) => renderBlockNode(child, idx))}
          </View>
        );
      }

      // Check if node is empty or only whitespace
      const hasContent = node.children?.some(
        (c) => (c.type === 'text' && c.text?.trim()) || (c.type === 'element' && c.tag !== 'br')
      );

      if (!hasContent) return null;

      return (
        <View key={index} style={styles.paragraphContainer}>
          <Text style={[styles.paragraphText, { fontSize: baseFontSize, lineHeight: Math.round(baseFontSize * 1.55) }]}>
            {node.children?.map((child, idx) => renderInlineNode(child, idx, {}))}
          </Text>
        </View>
      );
    }

    // Fallback block
    return (
      <View key={index} style={styles.blockContainer}>
        <Text style={[styles.paragraphText, { fontSize: baseFontSize }]}>
          {node.children?.map((child, idx) => renderInlineNode(child, idx, {}))}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {nodes.map((node, idx) => renderBlockNode(node, idx))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  blockContainer: {
    marginBottom: 4,
  },
  paragraphContainer: {
    marginBottom: 12,
  },
  paragraphText: {
    color: '#374151',
  },
  headingContainer: {
    marginTop: 14,
    marginBottom: 8,
  },
  headingText: {
    fontWeight: '700',
    color: '#111827',
  },
  listContainer: {
    marginTop: 6,
    marginBottom: 14,
    paddingLeft: 4,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletText: {
    color: '#8B0000',
    fontWeight: '700',
    marginRight: 6,
    lineHeight: 24,
  },
  listItemText: {
    flex: 1,
    color: '#374151',
  },
  imageContainer: {
    marginVertical: 12,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  inlineImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  imageCaption: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  hr: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
});

export default HtmlRenderer;
