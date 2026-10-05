class StateDiagramModule {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    this.diagramWrapper = document.createElement('div');
    this.diagramWrapper.style.flexGrow = '1';
    this.diagramWrapper.style.width = '100%';
    this.diagramWrapper.style.minHeight = '180px';
    this.diagramWrapper.style.position = 'relative';
    this.container.appendChild(this.diagramWrapper);

    this.networkDiv = document.createElement('div');
    this.networkDiv.style.position = 'absolute';
    this.networkDiv.style.top = '0';
    this.networkDiv.style.left = '0';
    this.networkDiv.style.right = '0';
    this.networkDiv.style.bottom = '0';
    this.networkDiv.style.backgroundColor = 'transparent';
    this.diagramWrapper.appendChild(this.networkDiv);

    this.network = new vis.Network(this.networkDiv, {nodes: [], edges: []}, {
      physics: { 
        enabled: true, 
        solver: 'repulsion', 
        repulsion: { nodeDistance: 90 } // Closer nodes for smaller graph
      },
      edges: { 
        arrows: 'to', 
        font: { align: 'top', color: '#2d3436', strokeWidth: 2, strokeColor: '#f8f9fa', size: 11 }, 
        color: '#74b9ff',
        smooth: { type: 'dynamic' }
      },
      nodes: { 
        shape: 'circle', 
        font: { color: '#2d3436', size: 14, bold: true },
        borderWidth: 2,
        margin: 5
      }
    });
  }

  update(rules) {
    let nodesArray = [];
    let edgesArray = [];
    let nodeSet = new Set();
    
    let edgesMap = {};

    for (let key in rules) {
      let parts = key.split(',');
      let fromState = parts[0];
      let readSym = parts[1];
      let rule = rules[key];
      let toState = rule.nextState;
      let label = `${readSym}/${rule.write},${rule.move}`;

      nodeSet.add(fromState);
      nodeSet.add(toState);

      let edgeKey = `${fromState}->${toState}`;
      if (!edgesMap[edgeKey]) {
        edgesMap[edgeKey] = { from: fromState, to: toState, labels: [] };
      }
      edgesMap[edgeKey].labels.push(label);
    }

    for (let key in edgesMap) {
      let e = edgesMap[key];
      edgesArray.push({ id: key, from: e.from, to: e.to, label: e.labels.join('\n') });
    }

    nodeSet.forEach(n => {
      let color = '#ffeaa7'; 
      let border = '#fdcb6e';
      
      if(n === 'q_accept') { color = '#55efc4'; border = '#00b894'; }
      else if(n === 'q_reject') { color = '#fab1a0'; border = '#d63031'; }
      else if(n === 'q0') { color = '#74b9ff'; border = '#0984e3'; } 
      
      nodesArray.push({ id: n, label: n, color: { background: color, border: border } });
    });

    this.network.setData({ nodes: new vis.DataSet(nodesArray), edges: new vis.DataSet(edgesArray) });
  }

  highlight(activeState, activeEdgeId) {
    if (!this.network || !this.network.body.data.nodes) return;

    let nodes = this.network.body.data.nodes;
    let edges = this.network.body.data.edges;

    let updatedNodes = [];
    nodes.forEach(n => {
      let color = '#ffeaa7'; 
      let border = '#fdcb6e';
      
      if (n.id === activeState) {
        color = '#ff7675';
        border = '#d63031';
      } else {
        if(n.id === 'q_accept') { color = '#55efc4'; border = '#00b894'; }
        else if(n.id === 'q_reject') { color = '#fab1a0'; border = '#d63031'; }
        else if(n.id === 'q0') { color = '#74b9ff'; border = '#0984e3'; } 
      }
      
      updatedNodes.push({ id: n.id, color: { background: color, border: border } });
    });
    nodes.update(updatedNodes);

    let updatedEdges = [];
    edges.forEach(e => {
      let isEdgeActive = (e.id === activeEdgeId);
      let color = isEdgeActive ? '#d63031' : '#74b9ff';
      let width = isEdgeActive ? 3 : 1;
      updatedEdges.push({ id: e.id, color: color, width: width });
    });
    edges.update(updatedEdges);
  }
}
