const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up unused UI components...');

// Based on grep analysis, these UI components are not being imported/used
const unusedUIComponents = [
    'accordion.jsx',
    'alert-dialog.jsx', 
    'alert.jsx',
    'aspect-ratio.jsx',
    'breadcrumb.jsx',
    'calendar.jsx',
    'carousel.jsx',
    'collapsible.jsx',
    'command.jsx',
    'context-menu.jsx',
    'dialog.jsx',
    'drawer.jsx',
    'dropdown-menu.jsx',
    'hover-card.jsx',
    'input-otp.jsx',
    'menubar.jsx',
    'navigation-menu.jsx',
    'pagination.jsx',
    'popover.jsx',
    'radio-group.jsx',
    'resizable.jsx',
    'scroll-area.jsx',
    'sheet.jsx',
    'skeleton.jsx',
    'slider.jsx',
    'switch.jsx',
    'table.jsx',
    'toggle.jsx',
    'toggle-group.jsx',
    'tooltip.jsx'
];

const uiDir = 'frontend/src/components/ui';
let removedCount = 0;

unusedUIComponents.forEach(component => {
    const filePath = path.join(uiDir, component);
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('✅ REMOVED:', component);
            removedCount++;
        } else {
            console.log('❌ NOT FOUND:', component);
        }
    } catch (err) {
        console.log('❌ ERROR removing', component + ':', err.message);
    }
});

console.log(`\n✅ UI Cleanup complete! Removed ${removedCount} unused components.`);

// Also remove the temp cleanup script
try {
    if (fs.existsSync('cleanup.js')) {
        fs.unlinkSync('cleanup.js');
        console.log('✅ Removed cleanup.js script');
    }
} catch (err) {
    console.log('❌ Error removing cleanup.js:', err.message);
}