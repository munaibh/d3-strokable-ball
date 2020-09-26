const svg = d3.select('.globe-container')
const width = window.innerWidth, height = window.innerHeight
const scale = width > height ? (height/2) : (width/2)
const projection = d3.geoOrthographic()
  .fitSize([width, height])
  .scale(scale)
  .translate([width / 2, height / 2])
  .clipAngle(90)

const initialScale = projection.scale()
const path = d3.geoPath().projection(projection)  
const sensitivity = 75

svg.call(d3.drag().on('drag', handleGlobeDrag))
svg.call(d3.zoom().on('zoom', onGlobeZoom))

queue()
  .defer(d3.json, "https://raw.githubusercontent.com/d3/d3.github.com/master/world-110m.v1.json")
  .defer(d3.json, "destinations.json")
  .await(function(error, world, places) {
    drawGlobeToDom(world, places)
    drawDataToDom(world, places)
    resolvePathPositions()
  })

function drawGlobeToDom(world, places) {
  svg
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'globe')
    .attr('r', initialScale)

  svg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("class", "globe__base")
    .attr("fill", "none")

  svg.append("path")
    .datum(topojson.object(world, world.objects.land))
    .attr("class", "globe__land")
    .attr("d", path)

  return svg
}

function drawDataToDom(_world, places) {
  const points = svg.append("g")
    .attr("class", "globe__points")
    .selectAll("globe__points")
    .data(places.features)
    .enter().append("g")

  const anchor = points.append('a')
    .attr("class", "globe__link")
    .attr("href", d => d.properties.link)
    .attr("target", '_blank')
    .on("click", handlePointClicked)

  anchor.append("circle")
    .attr("class", "globe__point")
    .attr("r", 25)

  anchor.append("text")
    .attr("class", "globe__text")
    .attr("target", '_blank')
    .text(d => d.properties.text)

  d3.select('.globe-use-links')
    .on("click", function() {
      window.useLinks = !window.useLinks
      this.innerHTML = window.useLinks ? 'Disable Linking' : 'Enable Linking'
    })

  return svg
}

function resolvePathPositions() {
  const scaling = [width / 2, height / 2]
  const centerPosition = projection.invert(scaling)

  svg.selectAll(".globe__point")
    .attr("cx", ({ geometry: { coordinates } }) => projection(coordinates)[0])
    .attr("cy", ({ geometry: { coordinates } }) => projection(coordinates)[1])
    .style("display", ({ geometry: { coordinates } }) => {
      var d = d3.geoDistance(coordinates, centerPosition)
      return (d > 1.57) ? 'none' : 'block'
    })

  svg.selectAll(".globe__text")
    .attr("transform", function({ geometry: { coordinates } }) {
      const [ longitude, latitude ] = projection(coordinates)
      const linkWidth = this.clientWidth/2
      return `translate(${longitude - linkWidth}, ${(latitude + 5)})`
    })
    .style("display", ({ geometry: { coordinates } }) => {
      var d = d3.geoDistance(coordinates, centerPosition)
      return (d > 1.57) ? 'none' : 'block'
    })
}

function handleGlobeDrag() {
  const rotate = projection.rotate()
  const k = sensitivity / projection.scale()
  projection.rotate([rotate[0] + d3.event.dx * k, rotate[1] - d3.event.dy * k])
  svg.selectAll(".globe__land").attr("d", path)
  resolvePathPositions()
}

function onGlobeZoom() {
  const isScaled = d3.event.transform.k <= 0.3
  if(isScaled) return d3.event.transform.k = 0.3
  projection.scale(initialScale * d3.event.transform.k)
  svg.selectAll(".globe__land").attr("d", path)
  svg.selectAll(".globe__base").attr("r", projection.scale())
  resolvePathPositions()
}

function handlePointClicked({properties}) {
  if(!window.useLinks) d3.event.preventDefault()
  d3.select('.globe-properties')
    .html(`<pre>${JSON.stringify(properties, undefined, 2)}</span>`)
}