# Chrome DevTools - Examples

This file contains practical workflow examples for using Chrome DevTools MCP server.

## Example 1: Identifying and Clicking Elements

```markdown
### Step 1: Take a snapshot
Use `take_snapshot` to get the page structure with uid values

### Step 2: Find the target element
Look for the element you want to interact with in the snapshot output

### Step 3: Interact with the element
Use the `uid` value with `click` or `fill`:

click(uid="element-123")
fill(uid="input-456", value="test@example.com")
```

## Example 2: Debugging Failed Page Load

```markdown
### Step 1: Check console messages
list_console_messages

### Step 2: Identify JavaScript errors
Look for error-level messages that might be breaking functionality

### Step 3: Check network requests
list_network_requests

### Step 4: Find failed requests
Filter for 4xx/5xx status codes that indicate failed resources

### Step 5: Evaluate specific values
evaluate_script(script="console.log(window.myGlobalVar)")
```

## Example 3: Performance Profiling Workflow

```markdown
### Step 1: Start performance trace
performance_start_trace(reload=true, autoStop=true)

### Step 2: Wait for page load
The trace will automatically stop after page load completes

### Step 3: Analyze the results
performance_analyze_insight

### Step 4: Look for issues
- LCP (Largest Contentful Paint) > 2.5s
- CLS (Cumulative Layout Shift) > 0.1
- Long tasks blocking the main thread
- Large JavaScript bundles
```

## Example 4: Form Automation

```markdown
### Step 1: Navigate to the page
navigate_page(url="https://example.com/login")

### Step 2: Take snapshot to find form fields
take_snapshot

### Step 3: Fill the form
fill_form(fields=[
  { uid: "email-input", value: "user@example.com" },
  { uid: "password-input", value: "securePass123" }
])

### Step 4: Submit the form
click(uid="submit-button")

### Step 5: Wait for confirmation
wait_for(text="Welcome back")
```

## Example 5: Multi-page Testing

```markdown
### Step 1: List all open pages
list_pages

### Step 2: Open a new page
new_page

### Step 3: Navigate to different URL
navigate_page(url="https://example.com/dashboard")

### Step 4: Switch between pages
select_page(pageId="page-1")
take_screenshot

select_page(pageId="page-2")
take_screenshot

### Step 5: Close unwanted pages
close_page(pageId="page-1")
```

## Example 6: Network Analysis

```markdown
### Step 1: Navigate to the page
navigate_page(url="https://example.com")

### Step 2: List all network requests
list_network_requests

### Step 3: Get details of specific request
get_network_request(requestId="request-123")

### Step 4: Analyze the response
Check:
- Status code (200, 404, 500, etc.)
- Response time
- Response size
- Response headers
- Response body
```

## Example 7: Viewport Emulation

```markdown
### Step 1: Resize for mobile testing
resize_page(width=375, height=667)  # iPhone SE

### Step 2: Take screenshot
take_screenshot

### Step 3: Resize for tablet
resize_page(width=768, height=1024)  # iPad

### Step 4: Take another screenshot
take_screenshot

### Step 5: Reset to desktop
resize_page(width=1920, height=1080)
```

## Example 8: Keyboard Interactions

```markdown
### Step 1: Focus on an input
click(uid="search-input")

### Step 2: Type text
fill(uid="search-input", value="test query")

### Step 3: Submit with Enter
press_key(key="Enter")

### Step 4: Use keyboard shortcuts
press_key(key="Control+A")  # Select all
press_key(key="Control+C")  # Copy
```

## Example 9: Handling Dialogs

```markdown
### Step 1: Trigger an action that shows a dialog
click(uid="delete-button")

### Step 2: Handle the confirmation dialog
handle_dialog(accept=true, promptText="")

# Or dismiss it
handle_dialog(accept=false)
```

## Example 10: File Upload

```markdown
### Step 1: Locate the file input
take_snapshot

### Step 2: Upload a file
upload_file(
  uid="file-input",
  filePath="/path/to/document.pdf"
)

### Step 3: Verify upload
wait_for(text="File uploaded successfully")
```

## Tips for Success

### Use Snapshots First
Always prefer `take_snapshot` over `take_screenshot` when you need to interact with elements. Snapshots provide the `uid` values required by interaction tools.

### Wait for Dynamic Content
Use `wait_for` with specific text when dealing with pages that load content dynamically:
```markdown
wait_for(text="Dashboard loaded", timeout=5000)
```

### Context Awareness
If working with multiple tabs, always verify the active page:
```markdown
list_pages
select_page(pageId="correct-page-id")
```

### Reasonable Timeouts
Don't set extremely long timeouts. If something takes more than 10 seconds, there's likely an issue:
```markdown
wait_for(text="...", timeout=10000)  # 10 seconds max
```

### Performance Traces
For accurate performance data, always reload the page during trace recording:
```markdown
performance_start_trace(reload=true, autoStop=true)
```
