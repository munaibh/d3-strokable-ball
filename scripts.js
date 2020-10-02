const baseClass = 'd3-globe'
const svg = d3.select(`.${baseClass}__globe`)
const container = document.querySelector(`.${baseClass}__svg`)

const files = ['https://raw.githubusercontent.com/d3/d3.github.com/master/world-110m.v1.json', 'destinations.json']
const width = container.clientWidth, height = container.clientHeight
const scale = width > height ? (height/2) : (width/2)
const projection = d3.geoOrthographic()
  .fitSize([width, height])
  .scale(scale)
  .translate([width / 2, height / 2])
  .clipAngle(90)

const initialScale = projection.scale()
const path = d3.geoPath().projection(projection)  
const sensitivity = 75
const promises = files.map((url) => d3.json(url))

svg.call(d3.drag().on('drag', handleGlobeDrag))
svg.call(d3.zoom().on('zoom', onGlobeZoom))

Promise.all(promises).then((values) =>{
  const [world, places] = values
  resolveInitalCenter(places)
  drawGlobeToDom(world, places)
  drawDataToDom(world, places)
  resolvePathPositions()
  container.dataset.visible = true
})

function drawGlobeToDom(world, places) {
  svg
    .attr('width', width)
    .attr('height', height)
    .attr('r', projection.scale())

  svg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr('class', `${baseClass}__base`)
    .attr("fill", "none")

  svg.append("path")
    .datum(topojson.object(world, world.objects.land))
    .attr('class', `${baseClass}__land`)
    .attr("d", path)

  return svg
}

function drawDataToDom(_world, places) {
  const points = svg.append("g")
    .attr('class', `${baseClass}__points`)
    .selectAll(`.${baseClass}__points`)
    .data(places.features)
    .enter().append("g")

  const anchor = points.append('g')
    .attr('class', `${baseClass}__group`)
    .on("click", handlePointClicked)

  anchor.append("circle")
    .attr('class', `${baseClass}__point`)
    .attr("r", 25)

  anchor.append("text")
    .attr('class', `${baseClass}__text`)
    .text(d => d.data.emoji)

  return svg
}

function resolveInitalCenter(places) {
  if(!places || places.length <= 0) return projection.rotate([0, 0])
  const [ longitude, latitude ] = places.features[0].coordinates
  projection.rotate([longitude * -1, latitude * -1])
}
function resolvePathPositions() {
  const scaling = [width / 2, height / 2]
  const centerPosition = projection.invert(scaling)

  svg.selectAll(`.${baseClass}__point`)
    .attr("cx", ({ coordinates }) => projection(coordinates)[0])
    .attr("cy", ({ coordinates }) => projection(coordinates)[1])
    .style("display", ({ coordinates }) => {
      var d = d3.geoDistance(coordinates, centerPosition)
      return (d > 1.57) ? 'none' : 'block'
    })

  svg.selectAll(`.${baseClass}__text`)
    .attr("transform", function({ coordinates }) {
      const [ longitude, latitude ] = projection(coordinates)
      const linkWidth = this.clientWidth/2
      return `translate(${longitude - linkWidth}, ${(latitude + 5)})`
    })
    .style("display", ({ coordinates }) => {
      var d = d3.geoDistance(coordinates, centerPosition)
      return (d > 1.57) ? 'none' : 'block'
    })
}

function handleGlobeDrag(event) {
  event.sourceEvent.stopPropagation()
  const rotate = projection.rotate()
  const k = sensitivity / projection.scale()
  projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k])
  svg.selectAll(`.${baseClass}__land`).attr("d", path)
  resolvePathPositions()
}

function onGlobeZoom(event) {
  const isScaled = event.transform.k <= 0.3
  if(isScaled) return event.transform.k = 0.3
  projection.scale(initialScale * event.transform.k)
  svg.selectAll(`.${baseClass}__land`).attr("d", path)
  svg.selectAll(`.${baseClass}__base`).attr("r", projection.scale())
  resolvePathPositions()
}

function handlePointClicked(_event, {data}) {
  d3.select(`.${baseClass}__data`)
    .html(`<pre>${JSON.stringify(data, undefined, 2)}</span>`)
}