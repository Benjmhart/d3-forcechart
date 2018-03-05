/*global fetch*/
import * as d3 from "d3";
import 'd3-selection-multi'


import './index.scss'
import './assets/flags.min.css'

const flags = require("./assets/blank.gif")

const width = window.innerWidth
const height = window.innerHeight

const svg = d3.select('body').append('svg').attrs({
    height,
    width
})

fetch("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json")
    .then(r=>r.json())
    .then(j=>{
        console.log(j)
        
        const nodes = j.nodes
        
        const links = j.links
        
        const linkForce =  d3.forceLink(links)
                        
        const sim = d3.forceSimulation()
            .nodes(nodes)
            .force("charge_force", d3.forceManyBody().strength(-10))
            .force("center_force", d3.forceCenter(width / 2, height / 2))
            .force("links", linkForce)
            .force("collision", d3.forceCollide().radius(16).strength(1.5))
            
        const link = svg.append("g")
            .attrs({"class": "links"})
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attrs({
                "stroke-width": 2,
                stroke: "red"
            })
        
        const node = d3.select('.flags').selectAll(".flag")
            .data(nodes)
            .enter()
            .append('div')
            .attrs({
                "class": d => `flag flag-${d.code}`,
                alt: d => d.country,
            })
        
        const tickActions = () => {
            
            
            node.style('transform', d => {
                const newX = Math.max(0, Math.min((width - 16), d.x - 8))
                const newY = Math.max(0, Math.min((height - 11), d.y - 6))
                return`translate(${newX}px, ${newY}px)`
                
            })
            link
                .attrs({
                    x1: d => d.source.x,
                    y1: d => d.source.y,
                    x2: d => d.target.x,
                    y2: d => d.target.y
                    
                });
        }
        
        function drag_start(d) {
            if (!d3.event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function drag_drag(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y  
        };
        
        function drag_end(d) {
            if (!d3.event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        const drag_handler = d3.drag()    
            .on("start", drag_start)
            .on("drag", drag_drag)
            .on("end", drag_end);
        
                        
        drag_handler(node);
        
        sim.on("tick", tickActions)
})