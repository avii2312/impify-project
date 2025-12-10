import React from 'react';

export function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-muted text-sm font-medium uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-foreground">
          {value}
        </h3>
        <p className="text-muted text-sm">
          {trend}
        </p>
      </div>
    </div>
  );
}