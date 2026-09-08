HOW TO ADD THE HOVER EFFECTS

1. Copy sheetlab-hover-effects.js into the same folder as your existing index.html.

2. Open index.html and add this line immediately before </body>:

<script src="sheetlab-hover-effects.js"></script>

3. Commit the two files to GitHub and wait for GitHub Pages to redeploy.

WHAT IT ADDS
- Smooth green highlight/slide effect for sidebar navigation items.
- Lift/glow effect on dashboard cards.
- Lift/press effect on buttons and action controls.
- Hover highlight on table/collection rows.
- Small tooltip behavior for existing title, aria-label, or data-hover-tip elements.
- Works with dynamically-rendered content and does not require a library.

IMPORTANT
- It does not change your loan calculations or database/local-storage data.
- It does not replace existing click handlers.
- If your system already has a file with the same name, use a different filename and change the script tag accordingly.
