# jquery-table-resize
Simple jQuery plugin for resizing HTML tables

# Dependencies
jQuery, probably one of the newer versions

# Usage

```
// Options shown below are default values
$('table').eeResizable({
    tolerance: 8,       // Pixels within column edge to listen for resizing.
    minWidth:  60,       // Minimum column width
    maxWidth:  1000     // Maximum column width
});
```

# Notes

I made this in a day for the company I work for.
I almost guarantee there are small bugs and possibly memory leaks, however it still seems to work better than the alternatives.
Feel free to submit a pull request.

