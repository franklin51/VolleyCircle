# VolleyCircle — Design System

**Single source of truth** for VolleyCircle's visual design tokens (colors, fonts, spacing,
radius). Every other doc and the app code should link here rather than restating values. See
[roadmap](../roadmap.md) for the plan and [STATUS.md](../../STATUS.md) for the docs map +
linking convention.

---

<a id="colors-fonts"></a>

## Colors & Fonts (Spec)

| Element              | Spec                                     |
| -------------------- | ---------------------------------------- |
| **Primary Color**    | #FEC42F (Mikasa Yellow)                  |
| **Secondary Color**  | #37474F (Dark Gray-Blue)                 |
| **Accent/Highlight** | #1E88E5 (Cool Blue for links/buttons)    |
| **Font**             | Inter (English), Noto Sans TC (Chinese)  |
| **Corner Radius**    | 16px for cards, buttons                  |
| **Icons**            | Lucide or Material Icons, outlined style |

---

<a id="theme-config"></a>

## Theme Configuration (Implementation)

The app-level theme object derived from the spec above. This is the canonical token set the
React Native app consumes — keep it in sync with the spec table and treat this file as the one
place either is defined.

```javascript
// Theme configuration
const theme = {
  colors: {
    primary: '#FEC42F',      // Mikasa Yellow
    secondary: '#37474F',    // Dark Gray-Blue
    accent: '#1E88E5',       // Cool Blue
    surface: '#FFFFFF',
    background: '#F5F5F5',
    error: '#FF5252',
    success: '#4CAF50',
    warning: '#FF9800'
  },
  fonts: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
    chinese: 'NotoSansTC-Regular'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24
  }
};
```
