function defaultSeparation(a, b) {
  return a.parent === b.parent ? 1 : 2;
}

function leafLeft(nodes) {
  return nodes[0];
}

function leafRight(nodes) {
  var last = nodes.length - 1;
  return nodes[last];
}

export function uCluster() {
  var separation = defaultSeparation,
      dx = 1,
      dy = 1,
      nodeSize = false,
      rooty = 100;

  function uCluster(root) {
    var nodes = root.nodes;

    var previousNode,
        x = 0;

    for (let node of nodes){
      node.x = previousNode ? x += separation(node, previousNode) : 0;
      node.y = 0;
      previousNode = node;
    }

    var left = leafLeft(nodes);
    var right = leafRight(nodes);
    var x0 = left.x - separation(left, right) / 2;
    var x1 = right.x + separation(right, left) / 2;

    for (let node of nodes){
      node.x = (node.x - x0) / (x1 - x0) * dx;
      node.y = dy;
    }

    return nodes;
  };

  uCluster.separation = function(x) {
    return arguments.length ? (separation = x, uCluster) : separation;
  };

  uCluster.size = function(x) {
    return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], uCluster) : (nodeSize ? null : [dx, dy]);
  };

  return uCluster;
}