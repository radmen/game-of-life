const main = () => {
  const $table = document.querySelector('table')
  const $start = document.querySelector('a[href="#start"]')
  const $stop = document.querySelector('a[href="#stop"]')
  const $population = document.querySelector('.population')

  const canvas = {
    width: 75,
    height: 50,
  }
  const cellState = {
    dead: Symbol('dead'),
    alive: Symbol('alive'),
  }

  let state
  let intervalId

  // Data processing
  //
  const createState = ({width, height}) => Array.from(Array(height))
    .map(
      () => Array.from(Array(width))
        .map(() => Math.random() <= 0.10
            ? cellState.alive
            : cellState.dead
        )
    )

  const getCell = ([rowPosition, cellPosition], state) => {
    const row = state[rowPosition]

    if (!row) return null
    return row[cellPosition]
  }

  const isAlive = (cell) => cell === cellState.alive
  const getNeighbors = ([rowPosition, cellPosition], state) => {
    const neighbourPositions = [
      [rowPosition - 1, cellPosition - 1],
      [rowPosition - 1, cellPosition],
      [rowPosition - 1, cellPosition + 1],
      [rowPosition, cellPosition - 1],
      [rowPosition, cellPosition + 1],
      [rowPosition + 1, cellPosition - 1],
      [rowPosition + 1, cellPosition],
      [rowPosition + 1, cellPosition + 1],
    ];

    return neighbourPositions.map((coords) => getCell(coords, state))
      .filter(Boolean)
  }

  const getCellNextState = (cell, neighbours) => {
    const dead = !isAlive(cell)
    const aliveNeighbours = neighbours.map(isAlive)
      .filter(Boolean)
      .length

    if (dead && aliveNeighbours === 3) return cellState.alive
    if (dead) return cellState.dead
    if (aliveNeighbours < 2) return cellState.dead
    if (aliveNeighbours >= 2 && aliveNeighbours <= 3) return cellState.alive

    return cellState.dead
  }

  const tick = (state) => state.map((rows, rowPosition) => rows.map(
    (cell, cellPosition) => getCellNextState(cell, getNeighbors([rowPosition, cellPosition], state))
  ))

  // Rendering
  //
  const markAlive = ($cell) => {
    $cell.classList.add('alive')
  }

  const markDead = ($cell) => {
    $cell.classList.remove('alive')
  }

  const createCanvas = () => {
    const counter = {...canvas}
    const cells = []

    do {
      const $row = document.createElement('tr')
      const row = []
      counter.width = canvas.width

      $table.appendChild($row)

      do {
        const $singleCell = document.createElement('td')
        $row.appendChild($singleCell)

        counter.width -= 1
        row.push($singleCell)
      } while (counter.width)

      counter.height -= 1
      cells.push(row)
    } while (counter.height)

    return cells
  }

  const render = (state, cells) => {
    let population = 0

    state.forEach((row, rowPosition) => {
      row.forEach((cell, cellPosition) => {
        const $cell = cells[rowPosition][cellPosition]

        if (isAlive(cell)) {
          population += 1
          markAlive($cell)
        }
        else {
          markDead($cell)
        }
      })
    })

    $population.textContent = population
  }

  const cells = createCanvas()
  state = createState(canvas)

  render(state, cells)

  const runSingleTick = () => {
    state = tick(state)
    render(state, cells)
  }

  $start.addEventListener('click', (event) => {
    intervalId = setInterval(runSingleTick, 500)

    $stop.style.display = null
    $start.style.display = 'none'
  })

  $stop.addEventListener('click', (event) => {
    clearInterval(intervalId)

    $start.style.display = null
    $stop.style.display = 'none'
  })
}

document.addEventListener('DOMContentLoaded', main)
