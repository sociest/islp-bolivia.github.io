-- islp-filter.lua
-- Pandoc AST filter for ISLP Bolivia Astro-grade enhancements

function Image(elem)
  -- Add lazy loading and decoding async to all images
  elem.attributes['loading'] = elem.attributes['loading'] or 'lazy'
  elem.attributes['decoding'] = elem.attributes['decoding'] or 'async'
  return elem
end

function Table(elem)
  -- Wrap tables in responsive container
  return {
    pandoc.RawBlock('html', '<div class="islp-table-responsive">'),
    elem,
    pandoc.RawBlock('html', '</div>')
  }
end

function BlockQuote(elem)
  -- Ensure blockquotes have semantic class
  local classes = elem.classes or {}
  table.insert(classes, "islp-blockquote")
  elem.classes = classes
  return elem
end
