 const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const gridSize = 20;
  const cols = canvas.width / gridSize;
  const rows = canvas.height / gridSize;

  const obstacles = [
    {x: 4, y: 0, w: 7, h: 2, entrances: [{x: 7, y: 1, name: "College Hostel"}]},
    {x: 12, y: 0, w: 5, h: 2, entrances: [{x: 14, y: 1, name: "TEI Building"}]},
    {x: 17, y: 2, w: 2, h: 2, entrances: [{name: "Wash Rack/Bus Parking"}]},
    {x: 12, y: 3, w: 3, h: 6, entrances: [{x: 14 , y: 5, name: "Girls Trades Building"}]},
    {x: 12, y: 10, w: 3, h: 8, entrances: [{x: 13 , y: 17, name: "LRV Pavilion"}]},
    {x: 17, y: 5, w: 2, h: 6, entrances: [{x: 17, y: 7, name: "Mechanical Technology"}]},
    {x: 17, y: 12, w: 2, h: 15.2, entrances: [{x: 17, y: 17, name: "Education Building"}]},
    {x: 4, y: 3, w: 7, h: 2, entrances: [{x: 7, y: 4, name: "FOA Building"}]},
    {x: 4, y: 6, w: 7, h: 2, entrances: [{x: 7, y: 7, name: "Learning Resource Hub"}]},
    {x: 4, y: 9, w: 2, h: 3, entrances: [{x: 5, y: 10, name: "Mechanical Building"}]},
    {x: 4, y: 13, w: 3, h: 7, entrances: [{x: 6, y: 16, name: "CAAT Building"}]},
    {x: 3, y: 22, w: 7, h: 2, entrances: [{ x: 8, y: 22, name: "REPED Building"}]},
    {x: 5, y: 24.3, w: 3, h: 1, entrances: [{ name: "Staff House"}]},
    {x: 11, y: 0, w: 1, h: 1, entrances: [{ name: "Motor Pool"}]},
    {x: 0, y: 23, w: 2, h: 4, entrances: [{name: "Laboratory HighSchool"}]},
    {x: 3, y: 25.7, w: 7, h: 1.5, entrances: [{ name: "New Administration Building"}]},
    {x: 12, y: 25.7, w: 5, h: 1.5, entrances: [{ x: 15, y: 27, name: "Old Administration Building"}]},
    {x: 3, y: 27.5, w: 7, h: 2, entrances: [{x: 6, y: 29, name: "Entrepreneurship Training Building"}]},
    {x: 8, y: 14, w: 3, h: 5, entrances: [{x: 10, y: 16, name: "PATVEP Building"}]},
    {x: 18, y: 28, w: 2, h: 1.7, entrances: [{name: "Staff House"}]},
    {x: 14, y: 28, w: 1, h: 1 , entrances: [{name: "TCC Building"}]},
    
  ];

  let start = null;
  let end = null;
  let path = [];
  let animationIndex = 0;
  let animationId = null;

  let hoveredObstacle = null;
  let mouseX = 0;
  let mouseY = 0;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    const gridX = Math.floor(mouseX / gridSize);
    const gridY = Math.floor(mouseY / gridSize);

    hoveredObstacle = null;
    for (const obs of obstacles) {
      if (
        gridX >= Math.floor(obs.x) &&
        gridX < Math.ceil(obs.x + obs.w) &&
        gridY >= Math.floor(obs.y) &&
        gridY < Math.ceil(obs.y + obs.h)
      ) {
        hoveredObstacle = obs;
        break;
      }
    }
    draw();
  });

  function createGrid() {
  let grid = Array(rows).fill(null).map(() => Array(cols).fill(0));

  // Mark buildings as obstacles
  for (const obs of obstacles) {
    for (let y = Math.floor(obs.y); y < Math.ceil(obs.y + obs.h); y++) {
      for (let x = Math.floor(obs.x); x < Math.ceil(obs.x + obs.w); x++) {
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          grid[y][x] = 1;
        }
      }
    }
    for (const ent of obs.entrances) {
      const gx = Math.round(ent.x);
      const gy = Math.round(ent.y);
      if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) {
        grid[gy][gx] = 0; 
      }
    }
  }

  const greenRanges = [
    { x1: 0, y1: 0, x2: 4, y2: 21 },
    { x1: 19, y1: 0, x2: 20, y2: 31,},
    {x1: 0, y1: 27, x2: 3, y2: 29.5}
    


  ];

  for (const range of greenRanges) {
    for (let y = Math.floor(range.y1); y < Math.ceil(range.y2); y++) {
      for (let x = Math.floor(range.x1); x < Math.ceil(range.x2); x++) {
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          grid[y][x] = 1; 
        }
      }
    }
  }

  return grid;
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'gray';
  for (const obs of obstacles) {
    ctx.fillRect(obs.x * gridSize, obs.y * gridSize, obs.w * gridSize, obs.h * gridSize);
    ctx.fillStyle = 'cyan';
    for (const ent of obs.entrances) {
      ctx.fillRect(ent.x * gridSize, ent.y * gridSize, gridSize, gridSize);
    }
    ctx.fillStyle = 'gray';
  }

  if (start) {
    ctx.fillStyle = 'green';
    ctx.fillRect(start.x * gridSize, start.y * gridSize, gridSize, gridSize);
  }
  if (end) {
    ctx.fillStyle = 'red';
    ctx.fillRect(end.x * gridSize, end.y * gridSize, gridSize, gridSize);
  }
  
  const highlightedCells = [
    { x: 9, y: 13, color: 'gray' },
    { x: 8, y: 13, color: 'gray' },
    { x: 0, y: 21, color: 'green' },
    { x: 0, y: 22, color: 'green' }
  ];
  for (const cell of highlightedCells) {
    ctx.fillStyle = cell.color;
    ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);
  }

  const highlightRanges = [
    { x1: 0, y1: 0, x2: 4, y2: 21, color:'green' },
    { x1: 19, y1: 0, x2: 20, y2: 27.2, color:'green' },
    { x1: 6, y1: 9, x2: 10, y2: 12, color:'green'},
    { x1: 17, y1: 0, x2: 20, y2: 2, color:'green'},
    { x1: 12, y1: 20, x2: 17, y2: 26, color:'green'},
    { x1: 0, y1: 27, x2: 3, y2: 29.5, color:'green'},

    { x1: 4, y1: 13, x2: 10, y2: 12, color:'gray'},
    { x1: 7, y1: 13, x2: 8, y2: 22, color:'gray'},
    { x1: 10, y1: 9, x2: 11, y2: 14, color:'gray'},
    { x1: 4, y1: 2, x2: 17, y2: 3, color:'gray' },
    { x1: 15, y1: 2, x2: 17, y2: 20, color:'gray' },
    { x1: 4, y1: 5, x2: 11, y2: 6, color:'gray' },
    { x1: 4, y1: 8, x2: 11, y2: 9, color:'gray' },
    { x1: 11, y1: 0, x2: 12, y2: 31, color:'gray' },
    { x1: 11, y1: 18, x2: 15, y2: 20, color:'gray' },
    { x1: 8, y1: 19, x2: 11, y2: 22, color:'gray'}, 
    { x1: 10, y1: 22, x2: 11, y2: 31, color:'gray'},
    { x1: 4, y1: 20, x2: 7, y2: 22, color:'gray'},
    { x1: 4, y1: 20, x2: 7, y2: 22, color:'gray'},
    { x1: 1, y1: 21, x2: 4, y2: 22, color:'gray'},
    { x1: 2, y1: 22, x2: 3, y2: 28.3, color:'gray'},
    { x1: 3, y1: 24, x2: 10, y2: 26, color:'gray'},
    { x1: 3, y1: 27, x2: 10, y2: 28, color:'gray'},
    { x1: 5, y1: 29.5, x2: 3, y2: 21, color:'gray'},
    { x1: 0, y1: 29.5, x2: 20, y2: 31, color:'gray'},
    { x1: 12, y1: 27, x2: 20, y2: 29.5, color:'gray'},


    { x1: 0, y1: 22.5, x2: 2.5, y2: 27.5, color:'brown' },
    { x1: 1, y1: 21.8, x2: 2.5, y2: 28.3, color:'brown' },
    { x1: 4, y1: 9, x2: 6, y2: 12, color:'brown' },
    { x1: 4, y1: 13, x2: 7, y2: 20, color:'brown' },
    { x1: 4, y1: 3, x2: 11, y2: 5, color:'brown' },
    { x1: 12, y1: 0, x2: 17, y2: 2, color:'brown'},
    { x1: 12, y1: 3, x2: 15, y2: 9, color:'brown'},
    { x1: 12, y1: 10, x2: 15, y2: 18, color:'brown'},
    { x1: 17, y1: 2, x2: 19, y2: 4, color:'brown'},
    { x1: 17, y1: 5, x2: 19, y2: 11, color:'brown'},
    { x1: 17, y1: 12, x2: 19, y2: 26, color:'brown'},
    { x1: 3, y1: 22, x2: 10, y2: 24, color:'brown'},
    { x1: 5, y1: 24.3, x2: 8, y2: 25.4, color:'brown'}, 
    { x1: 3, y1: 25.7, x2: 10, y2: 27.2, color:'brown'},
    { x1: 12, y1: 26, x2: 19, y2: 27.2, color:'brown'}, 
    { x1: 3, y1: 27.5, x2: 10, y2: 29.5, color:'brown'},
    { x1: 18, y1: 28, x2: 20, y2: 29.7, color:'brown'},
    { x1: 14, y1: 28, x2: 15, y2: 29, color:'brown'},

    { x1: 4, y1: 0, x2: 11, y2: 2, color:'#90EE90' },
    { x1: 4, y1: 6, x2: 11, y2: 8, color:'#90EE90' },
    { x1: 8, y1: 14, x2: 11, y2: 19, color:'90EE90'},

    { x1: 4, y1: 13, x2: 6, y2: 12, color:'#C48A47'},
    { x1: 17, y1: 4, x2: 19, y2: 5, color:'#C48A47'},
    { x1: 17, y1: 11, x2: 19, y2: 12, color:'#C48A47'},
    { x1: 12, y1: 9, x2: 15, y2: 10, color:'#C48A47'},

    { x1: 10, y1: 25.7, x2: 12, y2: 26, color:'red'},
    { x1: 11, y1: 0, x2: 12, y2: 1, color:'red'},  
  ];


  for (const range of highlightRanges) {
    const x = range.x1 * gridSize;
    const y = range.y1 * gridSize;
    const width = (range.x2 - range.x1) * gridSize;
    const height = (range.y2 - range.y1) * gridSize;
    ctx.fillStyle = range.color;
    ctx.fillRect(x, y, width, height);
  }

   if (path.length > 0) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(path[0].x * gridSize + gridSize / 2, path[0].y * gridSize + gridSize / 2);
    for (const p of path) {
      ctx.lineTo(p.x * gridSize + gridSize / 2, p.y * gridSize + gridSize / 2);
    }
    ctx.stroke();
  }

  if (hoveredObstacle) {
  const label = hoveredObstacle.entrances[0]?.name || "Building";
  ctx.font = '14px sans-serif';
  const textWidth = ctx.measureText(label).width;
  const padding = 4;
  const boxWidth = textWidth + padding * 2;
  const boxHeight = 20;

  let labelX = mouseX + 10;
  let labelY = mouseY - 24;

  if (labelX + boxWidth > canvas.width) {
    labelX = canvas.width - boxWidth - 2;
  }
  if (labelY < 0) {
    labelY = mouseY + 10;
  }

  ctx.fillStyle = 'white';
  ctx.fillRect(labelX, labelY, boxWidth, boxHeight);

  ctx.fillStyle = 'black';
  ctx.fillText(label, labelX + padding, labelY + 14);
}


  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.5;
  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * gridSize);
    ctx.lineTo(canvas.width, y * gridSize);
    ctx.stroke();
  }
  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * gridSize, 0);
    ctx.lineTo(x * gridSize, canvas.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
}

  function createDropdownOptions() {
    const startSelect = document.getElementById('startSelect');
    const endSelect = document.getElementById('endSelect');
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';

    for (const obs of obstacles) {
      for (const ent of obs.entrances) {
        if (typeof ent.x === 'number' && typeof ent.y === 'number') {
          const val = `${ent.x},${ent.y}`;
          const label = ent.name || 'Unnamed Entrance';
          startSelect.appendChild(new Option(label, val));
          endSelect.appendChild(new Option(label, val));
        }
      }
    }
  }

  document.getElementById('goBtn').addEventListener('click', () => {
    if (animationId) cancelAnimationFrame(animationId);
    const sVal = document.getElementById('startSelect').value;
    const eVal = document.getElementById('endSelect').value;
    if (!sVal || !eVal) {
      alert("Please select both start and end entrances.");
      return;
    }
    const [sx, sy] = sVal.split(',').map(Number);
    const [ex, ey] = eVal.split(',').map(Number);
    if (sx === ex && sy === ey) {
      alert("Start and end entrances cannot be the same.");
      return;
    }
    const grid = createGrid();
    start = {x: Math.round(sx), y: Math.round(sy)};
    end = {x: Math.round(ex), y: Math.round(ey)};
    path = astar(grid, start, end);
    if (path) {
      animationIndex = 0;
      animate();
    } else {
      alert("No path found!");
      start = null;
      end = null;
      path = [];
      draw();
    }
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (animationId) cancelAnimationFrame(animationId);
    start = null;
    end = null;
    path = [];
    animationIndex = 0;
    draw();
  });

  function astar(grid, start, end) {
    class Node {
      constructor(x, y, parent = null, g = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.g = g;
        this.h = h;
        this.f = g + h;
      }
    }

    const openSet = [];
    const closedSet = new Set();

    function key(n) {
      return `${n.x},${n.y}`;
    }

    openSet.push(new Node(start.x, start.y));

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();

      if (current.x === end.x && current.y === end.y) {
        const path = [];
        let temp = current;
        while (temp) {
          path.push({x: temp.x, y: temp.y});
          temp = temp.parent;
        }
        return path.reverse();
      }

      closedSet.add(key(current));

      const neighbors = [
        {x: current.x + 1, y: current.y},
        {x: current.x - 1, y: current.y},
        {x: current.x, y: current.y + 1},
        {x: current.x, y: current.y - 1}
      ];

      for (const n of neighbors) {
        if (n.x < 0 || n.x >= cols || n.y < 0 || n.y >= rows) continue;
        if (grid[n.y][n.x] === 1) continue;
        if (closedSet.has(key(n))) continue;

        const gScore = current.g + 1;
        const hScore = Math.abs(n.x - end.x) + Math.abs(n.y - end.y);
        const existing = openSet.find(node => node.x === n.x && node.y === n.y);

        if (!existing) {
          openSet.push(new Node(n.x, n.y, current, gScore, hScore));
        } else if (gScore < existing.g) {
          existing.g = gScore;
          existing.f = gScore + hScore;
          existing.parent = current;
        }
      }
    }
    return null;
  }

  function drawArrow(x, y, angle) {
    const cx = x * gridSize + gridSize / 2;
    const cy = y * gridSize + gridSize / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(0, -gridSize / 3);
    ctx.lineTo(gridSize / 2, 0);
    ctx.lineTo(0, gridSize / 3);
    ctx.lineTo(-gridSize / 4, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

 function animate() {
  if (animationIndex >= path.length - 1) {
    cancelAnimationFrame(animationId);
    draw();  // redraw everything
    drawArrow(path[path.length - 1].x, path[path.length - 1].y, 0);  // arrow on top
    return;
  }
  draw();  // draw all backgrounds first
  const p1 = path[animationIndex];
  const p2 = path[animationIndex + 1];
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  drawArrow(p1.x, p1.y, angle);  // draw arrow on top
  animationIndex++;
  animationId = requestAnimationFrame(animate);
}

  createDropdownOptions();
  draw();