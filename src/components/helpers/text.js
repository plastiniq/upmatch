export function getParentSelection (node) {
  var selection = window.getSelection()

  return [
    totalOffset(node, selection.anchorNode, selection.anchorOffset),
    totalOffset(node, selection.focusNode, selection.focusOffset)
  ]
}

function totalOffset (parent, selectionNode, selectionOffset) {
  var childNodes = getTextNodes(parent)
  var node = childNodes.shift()
  var childOffsetCount = 0

  while (childNodes.length && node !== selectionNode) {
    childOffsetCount += node.textContent.length
    node = childNodes.shift()
  }

  return selectionOffset + childOffsetCount
}

export function setParentSelection (node, position) {
  if (!node.textContent) {
    return
  }

  window.getSelection().setBaseAndExtent(...childOffset(node, position[0]), ...childOffset(node, position[1]))
}

function childOffset (parent, totalOffset) {
  var childNodes = getTextNodes(parent)
  var offset = 0
  var node = childNodes.shift()

  while (childNodes.length && offset + node.textContent.length < totalOffset) {
    offset += node.textContent.length
    node = childNodes.shift()
  }

  return [node, totalOffset - offset]
}

function getTextNodes (node) {
  return [ ...node.childNodes ].map(v => v.childNodes[0] || v)
}