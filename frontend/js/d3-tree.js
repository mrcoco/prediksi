/**
 * D3.js Decision Tree Visualization
 * Interactive Decision Tree untuk Sistem EduPro
 * Author: EduPro Development Team
 * Date: 16 Januari 2025
 */

class D3DecisionTree {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId}`);
        
        // Default options
        this.options = {
            width: options.width || 1200,
            height: options.height || 800,
            margin: options.margin || { top: 40, right: 40, bottom: 40, left: 40 },
            nodeRadius: options.nodeRadius || 25,
            fontSize: options.fontSize || 12,
            linkStroke: options.linkStroke || 2,
            colors: options.colors || {
                'Tinggi': '#28a745',
                'Sedang': '#ffc107', 
                'Rendah': '#dc3545',
                'internal': '#6c757d'
            },
            ...options
        };
        
        this.svg = null;
        this.g = null;
        this.tree = null;
        this.root = null;
        this.tooltip = null;
        
        this.init();
    }
    
    init() {
        // Clear existing content
        this.container.selectAll("*").remove();
        
        // Create SVG
        this.svg = this.container
            .append("svg")
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .style("background-color", "#f8f9fa")
            .style("border-radius", "8px")
            .style("border", "1px solid #dee2e6");
        
        // Create main group with margins
        this.g = this.svg.append("g")
            .attr("transform", `translate(${this.options.margin.left}, ${this.options.margin.top})`);
        
        // Create tree layout
        this.tree = d3.tree()
            .size([
                this.options.width - this.options.margin.left - this.options.margin.right,
                this.options.height - this.options.margin.top - this.options.margin.bottom
            ]);
        
        // Create tooltip
        this.tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", "1000");
        
        // Add title
        this.svg.append("text")
            .attr("x", this.options.width / 2)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .style("fill", "#212529")
            .text("Pohon Keputusan C4.5 - Prediksi Prestasi Siswa");
        
        // Add legend
        this.addLegend();
    }
    
    loadData(apiUrl, token) {
        const self = this;
        
        // Show loading state
        this.showLoading();
        
        // Fetch data from API
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                self.renderTree(data.tree_data);
            } else {
                self.showError(data.detail || 'Gagal memuat data tree');
            }
        })
        .catch(error => {
            console.error('Error loading tree data:', error);
            self.showError('Terjadi kesalahan saat memuat data tree');
        });
    }
    
    renderTree(treeData) {
        // Clear loading state
        this.hideLoading();
        
        // Process data
        this.root = d3.hierarchy(treeData);
        this.tree(this.root);
        
        // Clear existing tree
        this.g.selectAll(".link").remove();
        this.g.selectAll(".node").remove();
        
        // Draw links
        this.drawLinks();
        
        // Draw nodes
        this.drawNodes();
        
        // Add zoom and pan functionality
        this.addZoomPan();
    }
    
    drawLinks() {
        const self = this;
        
        const links = this.g.selectAll(".link")
            .data(this.root.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y))
            .style("fill", "none")
            .style("stroke", "#6c757d")
            .style("stroke-width", this.options.linkStroke)
            .style("stroke-opacity", 0.6);
        
        // Add edge labels
        const linkLabels = this.g.selectAll(".link-label")
            .data(this.root.links())
            .enter().append("text")
            .attr("class", "link-label")
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2 - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("fill", "#495057")
            .style("background", "white")
            .text(d => d.target.data.edge_label || "");
        
        // Add background for edge labels
        linkLabels.each(function(d) {
            const bbox = this.getBBox();
            d3.select(this.parentNode)
                .insert("rect", "text")
                .attr("x", bbox.x - 2)
                .attr("y", bbox.y - 1)
                .attr("width", bbox.width + 4)
                .attr("height", bbox.height + 2)
                .style("fill", "white")
                .style("stroke", "#dee2e6")
                .style("stroke-width", 1)
                .style("rx", 3);
        });
    }
    
    drawNodes() {
        const self = this;
        
        const nodes = this.g.selectAll(".node")
            .data(this.root.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .style("cursor", "pointer");
        
        // Add node circles/rectangles
        nodes.each(function(d) {
            const node = d3.select(this);
            
            if (d.data.type === "leaf") {
                // Leaf nodes - circles
                node.append("circle")
                    .attr("r", self.options.nodeRadius)
                    .style("fill", self.options.colors[d.data.prediction] || self.options.colors.internal)
                    .style("stroke", "#fff")
                    .style("stroke-width", 3)
                    .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))");
                
                // Prediction text
                node.append("text")
                    .attr("dy", "0.35em")
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("font-weight", "bold")
                    .style("fill", "white")
                    .text(d.data.prediction);
                
                // Samples count below
                node.append("text")
                    .attr("dy", self.options.nodeRadius + 15)
                    .attr("text-anchor", "middle")
                    .style("font-size", "10px")
                    .style("fill", "#6c757d")
                    .text(`n=${d.data.samples}`);
                
            } else {
                // Internal nodes - rectangles
                const rectWidth = 120;
                const rectHeight = 40;
                
                node.append("rect")
                    .attr("x", -rectWidth/2)
                    .attr("y", -rectHeight/2)
                    .attr("width", rectWidth)
                    .attr("height", rectHeight)
                    .attr("rx", 8)
                    .style("fill", self.options.colors.internal)
                    .style("stroke", "#fff")
                    .style("stroke-width", 2)
                    .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))");
                
                // Attribute name
                node.append("text")
                    .attr("dy", "-0.2em")
                    .attr("text-anchor", "middle")
                    .style("font-size", "11px")
                    .style("font-weight", "bold")
                    .style("fill", "white")
                    .text(d.data.attribute);
                
                // Threshold
                if (d.data.threshold !== undefined) {
                    node.append("text")
                        .attr("dy", "0.8em")
                        .attr("text-anchor", "middle")
                        .style("font-size", "9px")
                        .style("fill", "white")
                        .text(`≤ ${d.data.threshold}`);
                }
                
                // Samples count below
                node.append("text")
                    .attr("dy", rectHeight/2 + 15)
                    .attr("text-anchor", "middle")
                    .style("font-size", "10px")
                    .style("fill", "#6c757d")
                    .text(`n=${d.data.samples}`);
            }
        });
        
        // Add hover effects and tooltips
        nodes
            .on("mouseover", function(event, d) {
                // Highlight node
                d3.select(this).style("opacity", 0.8);
                
                // Show tooltip
                self.showTooltip(event, d);
            })
            .on("mouseout", function(event, d) {
                // Remove highlight
                d3.select(this).style("opacity", 1);
                
                // Hide tooltip
                self.hideTooltip();
            })
            .on("click", function(event, d) {
                // Node click handler - could expand/collapse or show details
                self.onNodeClick(d);
            });
    }
    
    showTooltip(event, d) {
        let tooltipContent = "";
        
        if (d.data.type === "leaf") {
            tooltipContent = `
                <strong>Prediksi: ${d.data.prediction}</strong><br/>
                <strong>Confidence: ${(d.data.confidence * 100).toFixed(1)}%</strong><br/>
                <strong>Samples: ${d.data.samples}</strong><br/>
                <strong>Distribusi Kelas:</strong><br/>
            `;
            
            if (d.data.class_distribution) {
                Object.entries(d.data.class_distribution).forEach(([cls, count]) => {
                    tooltipContent += `&nbsp;&nbsp;${cls}: ${count}<br/>`;
                });
            }
        } else {
            tooltipContent = `
                <strong>Atribut: ${d.data.attribute}</strong><br/>
                <strong>Threshold: ${d.data.threshold}</strong><br/>
                <strong>Samples: ${d.data.samples}</strong><br/>
                <strong>Kondisi: ${d.data.condition}</strong>
            `;
        }
        
        this.tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        
        this.tooltip.html(tooltipContent)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }
    
    hideTooltip() {
        this.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }
    
    onNodeClick(d) {
        // Could implement node expansion/collapse or detail view
        console.log("Node clicked:", d.data);
        
        // Example: Show detailed information in a modal
        this.showNodeDetails(d);
    }
    
    showNodeDetails(d) {
        // Create a simple modal or alert with node details
        let details = "";
        
        if (d.data.type === "leaf") {
            details = `
                Leaf Node Details:
                - Prediction: ${d.data.prediction}
                - Confidence: ${(d.data.confidence * 100).toFixed(1)}%
                - Samples: ${d.data.samples}
                - Class Distribution: ${JSON.stringify(d.data.class_distribution, null, 2)}
            `;
        } else {
            details = `
                Internal Node Details:
                - Attribute: ${d.data.attribute}
                - Threshold: ${d.data.threshold}
                - Condition: ${d.data.condition}
                - Samples: ${d.data.samples}
            `;
        }
        
        alert(details);
    }
    
    addLegend() {
        const legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${this.options.width - 150}, 50)`);
        
        const legendData = [
            { label: "Prestasi Tinggi", color: this.options.colors.Tinggi },
            { label: "Prestasi Sedang", color: this.options.colors.Sedang },
            { label: "Prestasi Rendah", color: this.options.colors.Rendah },
            { label: "Node Internal", color: this.options.colors.internal }
        ];
        
        const legendItems = legend.selectAll(".legend-item")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 25})`);
        
        legendItems.append("circle")
            .attr("r", 8)
            .style("fill", d => d.color);
        
        legendItems.append("text")
            .attr("x", 15)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("fill", "#212529")
            .text(d => d.label);
    }
    
    addZoomPan() {
        const zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on("zoom", (event) => {
                this.g.attr("transform", event.transform);
            });
        
        this.svg.call(zoom);
        
        // Add zoom controls
        this.addZoomControls();
    }
    
    addZoomControls() {
        const controls = this.svg.append("g")
            .attr("class", "zoom-controls")
            .attr("transform", "translate(20, 50)");
        
        // Zoom in button
        const zoomInBtn = controls.append("g")
            .attr("class", "zoom-btn")
            .style("cursor", "pointer");
        
        zoomInBtn.append("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("rx", 5)
            .style("fill", "#007bff")
            .style("stroke", "#fff")
            .style("stroke-width", 2);
        
        zoomInBtn.append("text")
            .attr("x", 15)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("+");
        
        // Zoom out button
        const zoomOutBtn = controls.append("g")
            .attr("class", "zoom-btn")
            .attr("transform", "translate(0, 35)")
            .style("cursor", "pointer");
        
        zoomOutBtn.append("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("rx", 5)
            .style("fill", "#007bff")
            .style("stroke", "#fff")
            .style("stroke-width", 2);
        
        zoomOutBtn.append("text")
            .attr("x", 15)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("-");
        
        // Reset button
        const resetBtn = controls.append("g")
            .attr("class", "zoom-btn")
            .attr("transform", "translate(0, 70)")
            .style("cursor", "pointer");
        
        resetBtn.append("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("rx", 5)
            .style("fill", "#6c757d")
            .style("stroke", "#fff")
            .style("stroke-width", 2);
        
        resetBtn.append("text")
            .attr("x", 15)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("⌂");
        
        // Add click handlers
        const self = this;
        zoomInBtn.on("click", () => {
            self.svg.transition().call(
                d3.zoom().transform,
                d3.zoomTransform(self.svg.node()).scale(1.5)
            );
        });
        
        zoomOutBtn.on("click", () => {
            self.svg.transition().call(
                d3.zoom().transform,
                d3.zoomTransform(self.svg.node()).scale(0.75)
            );
        });
        
        resetBtn.on("click", () => {
            self.svg.transition().call(
                d3.zoom().transform,
                d3.zoomIdentity
            );
        });
    }
    
    showLoading() {
        this.container.append("div")
            .attr("class", "loading-overlay")
            .style("position", "absolute")
            .style("top", "50%")
            .style("left", "50%")
            .style("transform", "translate(-50%, -50%)")
            .style("text-align", "center")
            .style("color", "#6c757d")
            .html(`
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <div style="margin-top: 10px;">Memuat visualisasi pohon keputusan...</div>
            `);
    }
    
    hideLoading() {
        this.container.selectAll(".loading-overlay").remove();
    }
    
    showError(message) {
        this.hideLoading();
        this.container.append("div")
            .attr("class", "error-message")
            .style("position", "absolute")
            .style("top", "50%")
            .style("left", "50%")
            .style("transform", "translate(-50%, -50%)")
            .style("text-align", "center")
            .style("color", "#dc3545")
            .style("padding", "20px")
            .html(`
                <i class="fas fa-exclamation-triangle fa-2x"></i>
                <div style="margin-top: 10px;">${message}</div>
                <button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="location.reload()">
                    Coba Lagi
                </button>
            `);
    }
    
    // Public method to refresh the tree
    refresh(apiUrl, token) {
        this.loadData(apiUrl, token);
    }
    
    // Public method to export tree as image
    exportAsImage(filename = 'decision-tree.png') {
        const svgElement = this.svg.node();
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL();
            link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
}

// Export for global use
window.D3DecisionTree = D3DecisionTree; 