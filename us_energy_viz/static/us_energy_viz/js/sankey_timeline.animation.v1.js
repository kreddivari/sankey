const build_animation = function build_animation(graphs, graph_nest, summary, svg, div) {
    // let i = 1;
    let years = Object.keys(graph_nest.strokes).sort().map(Number);
    //console.log(years);

    let n = 5; // years[i] - years[i-1];
    let duration = n * SPEED;
    var reach_end = false;

    function modifyOffset() {
        var el, newPoint, newPlace, offset, siblings, k;
        let range = document.getElementById("rangeSlider");
        width = range.offsetWidth;
        newPoint = (range.value - range.getAttribute("min")) / (range.getAttribute("max") - range.getAttribute("min"));
        offset = -2;
        if (newPoint < 0) {
            newPlace = 0;
        } else if (newPoint > 1) {
            newPlace = width;
        } else {
            newPlace = width * newPoint + offset;
            offset -= newPoint;
        }
        siblings = range.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            sibling = siblings[i];
            if (sibling.id == range.id) {
                k = true;
            }
            if ((k == true) && (sibling.nodeName == "OUTPUT")) {
                outputTag = sibling;
            }
        }
        outputTag.style.left = (newPlace + 2) + "px";
        outputTag.style.marginLeft = offset + "%";
        outputTag.innerHTML = range.value;
    }

    function animate_period(selected_year) {
        let i = years.indexOf(eval(selected_year));

        svg.selectAll('.label')
            .classed('hidden', function () {
                let d = d3.select(this);
                if (d.classed('sector')) {
                    return graphs[i].totals[d.attr('data-sector')] <= 0;
                } else if (d.classed('fuel')) {
                    return graphs[i].totals[d.attr('data-fuel')] <= 0;
                }
            });


        d3.selectAll('.animate')
            .on('mouseover', function () {
                /*
                 Show flows' popup
                  */
                let d = d3.select(this);
                if (d.classed('flow')) {
                    let l = graphs[i].graph.filter(function (e) {
                            return e.fuel === d.attr('data-fuel')
                        })
                        .filter(function (e) {
                            return e.box === d.attr('data-sector')
                        })[0];

                    div.attr("style", "");

                    div
                        .transition()
                        .duration(200)
                        .style('opacity', 1);
                    div
                        .html(get_fuel_name(l.fuel) + " → " + get_sector_name(l.box) + "<div class='fuel_value'>" + sigfig2(l.value) + "</div>")
                        .style('left', d3.event.pageX + 'px')
                        .style('top', d3.event.pageY - 35 + 'px');
                } else if (d.classed('fuel') && !d.classed('elec')) {
                    div.attr("style", "");

                    div
                        .transition()
                        .duration(200)
                        .style('opacity', 1);

                    div
                        .html(get_fuel_name(d.attr('data-fuel')) + " → " + sigfig2(eval(d.attr('data-value'))))
                        .style('left', d3.event.pageX + 'px')
                        .style('top', d3.event.pageY - 35 + 'px');
                }
            })
            .on('mouseout', () => {
                div
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .on('start', function () {
                let d = d3.select(this);
                d3.active(this)
                    /*
                     Update flows' geometry
                     */
                    .attr('d', function () {
                        if (d.classed('flow')) {
                            let l = graphs[i].graph.filter(function (e) {
                                    return e.fuel === d.attr('data-fuel')
                                })
                                .filter(function (e) {
                                    return e.box === d.attr('data-sector')
                                })[0];
                            return line(parse_line(l));
                        }
                    })
                    /*
                     Update flows' stroke width
                     */
                    .attr('stroke-width', function () {
                        if (d.classed('flow')) {
                            let s = graph_nest.strokes[years[i]][d.attr('data-fuel')][d.attr('data-sector')];
                            if (s > 0) {
                                return s + BLEED;
                            }
                            return 0;
                        }
                    })
                    .attr('y', function () {
                        /*
                         Update fuel box y-coordinate
                         */
                        if (d.classed('box') && d.classed('fuel')) {
                            return graph_nest.tops[years[i]][d.attr('data-fuel')];
                        }
                        /*
                         Update fuel box label y-coordinate
                         */
                        else if (d.classed('label') && d.classed('fuel')) {
                            return graph_nest.tops[years[i]][d.attr('data-fuel')] - 5;
                        }
                        return d.attr('y');
                    })
                    .attr('height', function () {
                        /*
                         Update sector box height
                         */
                        if (d.classed('box') && d.classed('sector')) {
                            return graph_nest.heights[years[i]][d.attr('data-sector')];
                        }
                        return d.attr('height');
                    })
                    .attr('data-value', function () {
                        /*
                         Update fuel total value
                         */
                        if (d.classed('label') && d.classed('fuel') && !d.classed('elec')) {
                            return graphs[i].totals[d.attr('data-fuel')];
                        }
                        return d.attr('data-value');
                    })
                    .tween('text', function () {
                        let that = this;
                        /*
                         Update year
                         */
                        if (d.classed('year')) {

                            let a = parseInt(that.textContent);
                            let b = years[i];
                            return function (t) {
                                let v = a + (b - a) * t;
                                that.setAttribute('data-value', v);
                                that.textContent = Math.round(v);
                            };
                            /**
                             * Update sector waste
                             */
                        } else if (d.classed('year-total')) {
                            let a = parseInt(that.textContent);
                            let b = years[i];
                            return function (t) {
                                let year_total = get_totals();
                                let sum_by_year = year_total[4];
                                let sum_value = Math.floor(sum_by_year[b]);
                                that.setAttribute('data-value', sum_value);
                                that.textContent = Math.round(sum_value) + " W/capita";
                            };
                            /**
                             * Update sector waste
                             */
                        } else if (d.classed('waste-level')) {
                            let a = parseFloat(that.getAttribute('data-value'));
                            let b = graph_nest.waste[years[i]][that.getAttribute('data-sector')];
                            return function (t) {
                                let v = a + (b - a) * t;
                                that.setAttribute('data-value', v);
                                that.textContent = sigfig2(v);
                            };
                            /*
                             Update sector total
                             */
                        } else if (d.classed('total')) {
                            let a = parseFloat(that.getAttribute('data-value'));
                            let b = graphs[i].totals[that.getAttribute('data-sector')];
                            return function (t) {
                                let v = a + (b - a) * t;
                                that.setAttribute('data-value', v);
                                that.textContent = sigfig2(v);
                            };
                        }
                    });
            });

        //i++;

        // if (i < graphs.length - 1) {
        //   setTimeout(animate_period, duration);
        // }

        modifyOffset();

    }

    //Run the update function when the slider is changed
    d3.select('#rangeSlider').on('input', function () {
        var b = d3.select("#rangeSlider");
        if (+b.property("value") !== +b.property("max")) {
            reach_end = false;
        } else {
            reach_end = true;
        }
        // d3.selectAll(".range-slider__value").text(this.value);
        animate_period(this.value);
    });

    let sliderWIDTH = $('#rangeSlider').width();

    let svgTopYear = d3.select('#axisTop')
        //.style('padding-left', '6px')
        // .style('height', 40 + 'px')
        .style('margin', '-5px')
        .append('svg')
        .attr('id', 'sliderYear')
        .attr('width', sliderWIDTH)
        .attr('height', 40)
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${sliderWIDTH} 40`);

    let svgTick = d3.select('#testTick')
        // .style('padding-left', '6px')
        .style('height', 15 + 'px')
        .style('margin', '-5px')
        .style('margin-top', '-7px')
        .append('svg')
        .attr('id', 'slider')
        .attr('width', sliderWIDTH)
        .attr('height', 50)
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${sliderWIDTH} 50`);

    let milestone_years = [];
    summary.totals.filter(function (d) {
        if (d.milestone !== undefined) {
            milestone_years.push(d.year);
        }
    });
    //console.log(milestone_years);

    var scale = d3.scaleLinear()
        .range([0, sliderWIDTH - LEFT_X])
        .domain([1800, 2017]);

    var year_data = [1805, 1825, 1850, 1875, 1900, 1925, 1950, 1975, 2000, 2015];
    
    var axisTop = d3.axisTop(scale)
        .tickValues(year_data)
        .tickFormat(function (d) {
            return ~~d; //"*"; // ~~d; // https://en.wikipedia.org/wiki/List_of_Unicode_characters
        });

    var gY =  svgTopYear.append("g")
        .attr("transform", "translate(0, 55)")
        .call(axisTop)
        .call(g => g.select(".domain")
           .remove())
        .call(g => g.selectAll("line")
           .remove());
    
    gY.selectAll('.tick text')
           // .filter(function (d) {
           //     return d === 1800 || d === 1870 || d === 1933;
           // })
           .attr('y', function (d, i) {
               return -15;
           });

    var axis = d3.axisBottom(scale)
        .tickValues(milestone_years)
        .tickFormat(function (d) {
            return "\u25CF"; //"*"; // ~~d; // https://en.wikipedia.org/wiki/List_of_Unicode_characters
        });
    
    var gX = svgTick.append("g")
        .attr("transform", "translate(4, 0)")
        .call(axis)
	    .call(g => g.select(".domain")
        .remove());

    // gX.select(".tick text").attr("x", 10);

    gX.selectAll('.tick text')
        // .filter(function (d) {
        //     return d === 1800 || d === 1870 || d === 1933;
        // })
        .style("font-size", "20px")
        .attr('y', function (d, i) {
            return 3;
        });

    gX.selectAll(".tick").select("text")
        .on("click", function (year) {
            animate_period(year);
            d3.select('#rangeSlider').node().focus();
            d3.select('#rangeSlider').property("value", year);
            var b = d3.select("#rangeSlider");
            if (+b.property("value") !== +b.property("max")) {
                reach_end = false;
            } else {
                reach_end = true;
            }

            // d3.select(".range-slider__value").text(year);
            modifyOffset();
            clearInterval(myTimer);
            // myTimer = 0;
            d3.select("#play-button").classed("playbutton");
            let year_info = summary.totals.filter(function (d) {
                return d.year === year;
            })[0];

            div
                .transition()
                .duration(200)
                .style('opacity', 1);

            let leftMargin = 0;
            
            if (d3.event.pageX - 50 < 0) {
                leftMargin = 10;
            } else {
                leftMargin = d3.event.pageX - 35;
            }

            div
                .html("<b>" + year_info.year + ": </b>" + year_info.milestone)
                .style('left', (d3.event.pageX - leftMargin) + 'px')
                .style('top', d3.event.pageY + 15 + 'px')
                .style('right', '35px');
        }).on('mouseout', () => {
            div
                .transition()
                .duration(500)
                .style('opacity', 0);
            // d3.select("#play-button").dispatch("click");
        });

    var jButton = d3.select("#jButton");
    jButton
        .on("click", function () {
            var button = d3.select(this);

                var b = d3.select("#rangeSlider");
                if (reach_end) {
                    reach_end = false;
                    t = +b.property("min");
                    b.property("value", t);
                }
                    //var b = d3.select("#rangeSlider");
                    var t = (+b.property("value") ) % (+b.property("max"));
                    var t=t+10;
                    if (t == 0) {
                        clearInterval(myTimer);
                        reach_end = true;
                        return false;
                    }
                    b.property("value", t);
                    animate_period(t);
        });
        var kButton = d3.select("#kButton");
            kButton
                .on("click", function () {
                    var button = d3.select(this);

                        var b = d3.select("#rangeSlider");
                        if (reach_end) {
                            reach_end = false;
                            t = +b.property("min");
                            b.property("value", t);
                        }
                            //var b = d3.select("#rangeSlider");
                            var t = (+b.property("value") ) % (+b.property("max"));
                            var t=t-10;
                            if (t == 0) {
                                clearInterval(myTimer);
                                reach_end = true;
                                return false;
                            }
                            b.property("value", t);
                            animate_period(t);
                });
    var playButton = d3.select("#play-button");
    playButton
        .on("click", function () {
            var button = d3.select(this);
            if (button.classed("playpaused")) {
                clearInterval(myTimer);
                // myTimer = 0;
                //button.text("Play");
                button.attr("class", "playbutton");
            } else {
                var b = d3.select("#rangeSlider");
                if (reach_end) {
                    reach_end = false;
                    t = +b.property("min");
                    b.property("value", t);
                }
                myTimer = setInterval(function () {
                    //var b = d3.select("#rangeSlider");
                    var t = (+b.property("value") + 1) % (+b.property("max") + 1);
                    if (t == 0) {
                        clearInterval(myTimer);
                        //  button.text("Play");
                        button.attr("class", "playbutton");
                        reach_end = true;
                        return false;
                    }
                    b.property("value", t);
                    // d3.select(".range-slider__value").text(t);
                    animate_period(t);
                }, duration / 4);
                //button.text("Pause");

                button.attr("class", "playpaused");
            }
        });

    d3.select("#play-button").dispatch("click");

};