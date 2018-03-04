/*global fetch*/
import * as d3 from "d3";
import 'd3-selection-multi'


import './index.scss'
import './assets/flags.min.css'

const flags = require("./assets/blank.gif")

const width = window.innerWidth * 0.7
const height = window.innerHeight * 0.7

const svg = d3.select('body').append('svg').attrs({
    height,
    width
})

fetch("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json")
    .then(r=>r.json())
    .then(j=>{
        console.log(j)
        
        const nodes = [
            {"id": "Travis", "sex": "M"},
            {"id": "Rake", "sex": "M"},
            {"id": "Diana", "sex": "F"},
            {"id": "Rachel", "sex": "F"},
            {"id": "Shawn", "sex": "M"},
            {"id": "Emerald", "sex": "F"}
        ]
        
        const links = [
            {"source": "Travis", "target": "Rake"},
            {"source": "Diana", "target": "Rake"},
            {"source": "Diana", "target": "Rachel"},
            {"source": "Rachel", "target": "Rake"},
            {"source": "Rachel", "target": "Shawn"},
            {"source": "Emerald", "target": "Rachel"}
        ]
        
        const linkForce =  d3.forceLink(links)
                        .id((d) =>d.id)
                        
        const sim = d3.forceSimulation()
            .nodes(nodes)
            .force("charge_force", d3.forceManyBody())
            .force("center_force", d3.forceCenter(width / 2, height / 2))
            .force("links", linkForce);
            
        const link = svg.append("g")
            .attrs({"class": "links"})
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attrs({"stroke-width": 2})
        
        const node = svg.append("g")
            .attrs({"class": "nodes"})
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attrs({r: 5, fill: "red"})
        
        const tickActions = () => {
            node
                .attrs({
                    cx: d => d.x,
                    cy: d => d.y 
                })
            link
                .attrs({
                    x1: d => d.source.x,
                    y1: d => d.source.y,
                    x2: d => d.target.x,
                    y2: d => d.target.y
                    
                });
        }
        
        const drag_handler = d3.drag()
            .on("drag", (d) => {
                d3.select(this)
                .attrs({
                    cx: d.x = d3.event.x,
                    cy: d.y = d3.event.y  
                });
            });
                        
        drag_handler(node);
        
        sim.on("tick", tickActions)
})