import * as d3Shape from 'd3-shape'
import * as d3Selection from 'd3-selection'
import * as d3Scale from 'd3-scale'
import * as d3Transition from 'd3-transition'
import * as d3Ease from 'd3-ease'

const CURVE_SCALE = 0.94

export default function update (svgNode, comparator, profile, width, height, bottom) {
  const d3 = Object.assign({}, d3Shape, d3Selection, d3Scale, d3Transition, d3Ease)
  var graphData = []
  var freelancerData = []
  var maxOutput = 0
  var maxY = 0
  const svg = d3.select(svgNode).attr('viewBox', `0 0 ${width} ${height}`)

  if (comparator && profile) {
    maxOutput = comparator.maxOutput

    graphData = Object.keys(comparator.properties).map(key => {
      let maxGroup = comparator.properties[key].findMaxGroup(profile[key])
      return {key, x: maxGroup.x, y: maxGroup.y, test: comparator.properties[key].intersection(profile[key]) }
    })

    freelancerData = graphData.map(v => (
      { y: isNaN(v.x) ? v.test : (v.x ? profile[v.key] / v.x * v.y : 0) }
    ))

    maxY = Math.max(...freelancerData.map(v => v.y), maxOutput)
  }

  const ease = d3.transition()
    .duration(1000)
    .ease(d3.easeCubicOut)
  
  var xScale = d3.scaleLinear()
    .domain([0, graphData.length * 2])
    .range([0, width])

  var yScale = d3.scaleLinear()
    .domain([0, maxY * CURVE_SCALE])
    .range([height - bottom, 0])

  var zeroLine = d3.line()
    .x(function(d, i) { return xScale(i) })
    .y(function() { return yScale(0) })
    .curve(d3.curveBasis)

  var line = d3.line()
    .x(function(d, i) { return xScale(i) })
    .y(function(d) { return yScale(d.y * 1.4) }) 
    .curve(d3.curveBasis)

  drawArea('me', freelancerData)
  drawArea('customer', graphData)

  function drawArea (className, data, delay = 0) {
    svg.selectAll(`.${className}`).data(data.length ? [addZeroPoints(data)] : [])
    .join(
      enter => enter.append('path').attr('class', className).attr('d', function (d, i) { return zeroLine(d, i) }).call(selection => selection.each(function(){ this._d = d3.select(this).attr('d') })).call(selection => selection.transition(ease).delay(delay).attr('d', function (d,i) { return line(d, i) })),
      update => update.attr('d', zeroLine).call(selection => selection.transition(ease).duration(1000).attr('d', function (d,i) { return line(d, i) })),
      remove => remove.transition().duration(1000).attr('d', function () { return this._d }).remove()
    )
  }

  svg.selectAll('.axis-text').data(graphData).join(
    enter => enter.append('text').text(d => d.key).attr('class', 'axis-text').attr('text-anchor', 'middle').attr('dy', yScale(0) + bottom).attr('dx', (d, i) => xScale(i * 2 + 1)).call(selection => selection.attr('fill-opacity', 0).transition().duration(500).delay((d, i) => i * 200).attr('fill-opacity', 1)),
    update => update,
    exit => exit.remove()
  )

  function addZeroPoints (arr) {
    var res = [{ y: 0 }]
    arr.forEach(v => res.push(v, { y: 0 }))
    return res
  }
}