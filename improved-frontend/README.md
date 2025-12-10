# Impify Admin Panel - Modern UI/UX

A complete admin panel for the Impify AI learning platform with modern design, animations, and responsive layouts.

## 📁 Files Included

### Admin Pages (`/src/pages/`)

| File | Description |
|------|-------------|
| `AdminDashboard.jsx` | Overview with stats, charts, activity feed, quick actions |
| `AdminUsers.jsx` | User management with modals, search, filters, pagination |
| `AdminPayments.jsx` | Transaction history, CSV export, status filters |
| `AdminTokens.jsx` | Token pack management (CRUD operations) |
| `AdminAnalytics.jsx` | Platform analytics with charts and system health |
| `AdminNotifications.jsx` | Send announcements, notification history |
| `AdminCommunity.jsx` | Post moderation, flagged content review |
| `AdminSupport.jsx` | Support ticket management with replies |
| `AdminSettings.jsx` | System, AI, email, security configuration |

## 🎨 Design System

### Color Gradients
- **Blue-Cyan**: Users, general stats
- **Emerald-Teal**: Payments, revenue, success
- **Purple-Pink**: Premium, AI features
- **Amber-Orange**: Tokens, rewards
- **Red-Rose**: Danger, alerts

### Glassmorphism Style
```css
bg-slate-900/50
backdrop-blur-xl
border border-white/[0.08]
hover:border-white/20
```

### Animations (Framer Motion)
- **Initial**: `opacity: 0, y: 20` → `opacity: 1, y: 0`
- **Hover**: `y: -4, scale: 1.02`
- **Loading**: `rotate: 360deg infinite`
- **Stagger**: `delay: index * 0.05s`

## 📦 Dependencies

```json
{
  "framer-motion": "^10.x",
  "lucide-react": "^0.263.1",
  "sonner": "^1.x",
  "file-saver": "^2.x",
  "@/components/ui/button": "shadcn/ui"
}
```

## 🔌 API Integration

Each page expects these API endpoints:

### Dashboard
- `adminAPI.getDashboardStats()`
- `adminAPI.getDashboardActivity()`

### Users
- `adminAPI.getUsers()`
- `adminAPI.addUserTokens(userId, amount)`
- `adminAPI.updateUserStatus(userId, status)`

### Payments
- `GET /admin/payments`
- `GET /admin/export/payments.csv`

### Token Packs
- `GET /token-packs`
- `POST /admin/token-packs`
- `PUT /admin/token-packs/:id`
- `DELETE /admin/token-packs/:id`

### Analytics
- `adminAPI.getAnalytics(timeRange)`
- `GET /admin/stats`
- `adminAPI.exportAnalytics()`

### Notifications
- `adminAPI.getNotifications()`
- `adminAPI.createNotification(data)`
- `adminAPI.deleteNotification(id)`

### Community
- `adminAPI.getCommunityPosts()`
- `adminAPI.getCommunityStats()`
- `adminAPI.moderatePost(postId, action)`

### Support
- `adminAPI.getSupportTickets()`
- `adminAPI.getSupportStats()`
- `adminAPI.addTicketReply(ticketId, message)`
- `adminAPI.updateTicketStatus(ticketId, status)`

### Settings
- `adminAPI.getSettings()`
- `adminAPI.updateSettings(settings)`
- `adminAPI.resetSettings()`
- `adminAPI.testEmail()`

## 📱 Responsive Breakpoints

- **Mobile**: Single column, touch-friendly
- **Tablet (sm)**: 2 columns
- **Desktop (lg)**: 4 columns, sidebar visible

## ♿ Accessibility

- Focus states with outline offset
- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast: WCAG AA+

## 🚀 Usage

1. Copy all files to your `/src/pages/` directory
2. Ensure `AdminSidebar` component exists
3. Configure routes in your router
4. Update API service to match your backend

### Route Configuration Example
```jsx
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminPayments from './pages/AdminPayments';
import AdminTokens from './pages/AdminTokens';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminNotifications from './pages/AdminNotifications';
import AdminCommunity from './pages/AdminCommunity';
import AdminSupport from './pages/AdminSupport';
import AdminSettings from './pages/AdminSettings';

// In your router
<Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
<Route path="/admin/users" element={<AdminUsers onLogout={handleLogout} />} />
<Route path="/admin/payments" element={<AdminPayments onLogout={handleLogout} />} />
<Route path="/admin/tokens" element={<AdminTokens onLogout={handleLogout} />} />
<Route path="/admin/analytics" element={<AdminAnalytics onLogout={handleLogout} />} />
<Route path="/admin/notifications" element={<AdminNotifications onLogout={handleLogout} />} />
<Route path="/admin/community" element={<AdminCommunity onLogout={handleLogout} />} />
<Route path="/admin/support" element={<AdminSupport onLogout={handleLogout} />} />
<Route path="/admin/settings" element={<AdminSettings onLogout={handleLogout} />} />
```

## 📝 Component Patterns

### StatCard
Reusable stat card with icon, value, and optional trend indicator.

### Modal Pattern
Fixed overlay with centered card, backdrop blur, animation.

### Table Pattern
Searchable, filterable, paginated data tables.

### Form Pattern
Consistent input styling with validation feedback.

---

Built with ❤️ for Impify
