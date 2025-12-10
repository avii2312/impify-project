// Frontend Analytics Tracking Utility

class AnalyticsTracker {
  constructor() {
    this.sessionStart = Date.now();
    this.pageViews = {};
    this.interactions = [];
  }

  // Track page view
  trackPageView(pageName) {
    const now = Date.now();
    if (this.pageViews[pageName]) {
      this.pageViews[pageName].visits += 1;
      this.pageViews[pageName].lastVisit = now;
    } else {
      this.pageViews[pageName] = {
        visits: 1,
        firstVisit: now,
        lastVisit: now
      };
    }
    console.log(`[Analytics] Page View: ${pageName}`);
  }

  // Track user interaction (clicks, form submissions, etc.)
  trackInteraction(action, data = {}) {
    const interaction = {
      action,
      data,
      timestamp: Date.now(),
      timeFromSessionStart: Date.now() - this.sessionStart
    };
    this.interactions.push(interaction);
    console.log(`[Analytics] Interaction: ${action}`, data);
  }

  // Track time spent on page
  getTimeSpent(pageName) {
    if (!this.pageViews[pageName]) return 0;
    const view = this.pageViews[pageName];
    return Date.now() - view.lastVisit;
  }

  // Get session summary
  getSessionSummary() {
    return {
      sessionDuration: Date.now() - this.sessionStart,
      pageViews: this.pageViews,
      totalInteractions: this.interactions.length,
      interactions: this.interactions
    };
  }

  // Track feature usage
  trackFeatureUsage(feature, metadata = {}) {
    this.trackInteraction('feature_used', {
      feature,
      ...metadata
    });
  }

  // Track errors
  trackError(error, context = {}) {
    this.trackInteraction('error', {
      message: error.message || error,
      stack: error.stack,
      context
    });
  }
}

// Create singleton instance
const analytics = new AnalyticsTracker();

export default analytics;

// Convenience functions
export const trackPageView = (pageName) => analytics.trackPageView(pageName);
export const trackClick = (elementName, data) => analytics.trackInteraction('click', { element: elementName, ...data });
export const trackUpload = (fileInfo) => analytics.trackFeatureUsage('upload', fileInfo);
export const trackExport = (noteInfo) => analytics.trackFeatureUsage('export', noteInfo);
export const trackDelete = (noteInfo) => analytics.trackFeatureUsage('delete', noteInfo);
export const trackError = (error, context) => analytics.trackError(error, context);
