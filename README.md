<p align="center">
  <span style="font-size: 80px">🌍</span>
  <h1 align="center">D3 Draggable Globe</h1>
</p>

<p align="center">
  <b>A D3 draggable globe, which allows plotting of points via a json endppoint. Also, allows data to be associated and rendered which each point.</b><br>
  <sub>
    Demo: <a href="https://munaibh.github.io/d3-destination-globe-drag/">https://munaibh.github.io/d3-destination-globe-drag</a> 
  </sub>
</p>


## Usage

This projects plots points found in `points.json` in the `public` directory, any properties placed in the `data` object will be available on clicking of the point. The `coordinates` and are the longitude and latitude for each point. Below is a sample json file.

```json
{
  "features": [
    { "data": { "index": 1, "emoji": "👌" }, "coordinates": [ -122.417168773552248, 37.769195629687431 ] } ,
    { "data": { "index": 2, "emoji": "👍" }, "coordinates": [ -87.752000832709314, 41.831936519278429 ] } , 
    { "data": { "index": 3, "emoji": "🍿" }, "coordinates": [ -118.243683, 34.052235 ] } ,
    { "data": { "index": 4, "emoji": "🕐" }, "coordinates": [ -114.062019, 51.044270 ] }, 
    { "data": { "index": 5, "emoji": "🧠" }, "coordinates": [ 2.154007, 41.390205 ] }  
  ]
}
```

## Theming

CSS Variables can be applied to the `:root` element to theme the globe on the page, the available variables are listed below:

```css
--globe-base-colour
--globe-land-colour
--globe-land-stroke-colour
--globe-point-background-colour
--globe-point-stroke-colour
--globe-point-text-colour

--globe-point-hover-stroke-colour
--globe-point-hover-background-colour
--globe-point-hover-text-colour
```

## Credits

This code references an existing globe project found here (http://bl.ocks.org/tlfrd/df1f1f705c7940a6a7c0dca47041fec8), thank you generous soul!



<br>
<h3 align="center">
  Enjoy! 🤙
</h3>

