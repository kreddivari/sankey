var setFromCookie = function () {
    var waste_required = Cookies.get('waste_required');
    if (waste_required == undefined) {
        $("#waste_required").prop('checked', true);
        $("#lbl_waste_hide_show").html('Hide electricity waste heat');
        Cookies.set("waste_required", true);
    } else if (waste_required == "true") {
        $("#waste_required").prop('checked', true);
        $("#lbl_waste_hide_show").html('Hide electricity waste heat');
    } else {
        $("#waste_required").prop('checked', false);
        $("#lbl_waste_hide_show").html('Show electricity waste heat');
    }
};

(function () {
    'use strict';

    let show_waste = Cookies.get('waste_required');

    let state = false;

    // Sort data chronologically
    DATA.sort(function (a, b) {
        return a.year - b.year;
    });


    // Define the div for the tooltip
    const div = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    let svg = d3.select('.sankey')
        .append('svg')
        .attr('id', 'chart')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    draw_title(svg);

    // Add layers for fuels
    for (let i = 0; i < FUELS.length; ++i) {
        svg.append('g')
            .attr('class', 'fuel ' + FUELS[i].fuel);
    }

    if (show_waste == "true" || show_waste == undefined) {
        svg.append('g').attr('class', 'fuel waste');
    }

    /*
     Build nested graph object
     */
    let graph_nest = {
        strokes: {},
        tops: {},
        heights: {},
        waste: {}
    };

    for (let i = 0; i < graphs.length; ++i) {
        let top = TOP_Y;
        let y = graphs[i].year;
        graph_nest.strokes[y] = {};
        graph_nest.tops[y] = {};
        graph_nest.heights[y] = {};
        graph_nest.waste[y] = {};

        if (show_waste == "true" || show_waste == undefined) {
            graph_nest.strokes[y]['waste'] = {};
        }

        for (let j = 0; j < FUELS.length; ++j) {
            let f = FUELS[j].fuel;

            graph_nest.strokes[y][f] = {};

            if (f !== 'elec') {
                graph_nest.tops[y][f] = top;
                top += summary.totals[i][f] * SCALE + LEFT_GAP;
            } else {
                graph_nest.tops[y][f] = ELEC_BOX[1] - summary.totals[i].elec * SCALE;
            }

            // let total_waste = 0;
            for (let k = 0; k < BOXES.length; ++k) {
                let b = BOXES[k].box;

                // if (b !== 'elec') {
                graph_nest.waste[y][b] = DATA[i].waste[b];
                // total_waste += DATA[i].waste[b];
                // }

                graph_nest.heights[y][b] = summary.totals[i][b] * SCALE;

                let s =
                    graphs[i].graph.filter(function (d) {
                        return d.fuel === f;
                    })
                    .filter(function (d) {
                        return d.box === b;
                    })[0];
                if (!(s === undefined || s === null)) {
                    graph_nest.strokes[y][f][b] = s.stroke;
                }
            }
            // graph_nest.waste[y]['elec'] = total_waste;

            if (show_waste == "true" || show_waste == undefined) {
                // Adding strokes for Waste to right sides boxes
                let w =
                    graphs[i].graph.filter(function (d) {
                        return d.fuel === 'waste';
                    });

                for (var key in w) {
                    graph_nest.strokes[y][w[key].fuel][w[key].box] = w[key].stroke;
                }
            }
        }
    }

    state = draw_initial_graph(svg, graph_nest, div);

    // build_animation(graphs, summary, svg); // v0
    build_animation(graphs, graph_nest, summary, svg, div); // v1


    var chart = $("#chart"),
        aspectChart = chart.width() / chart.height(),
        container = chart.parent();

    var title = $("#title"),
        aspectTitle = title.width() / title.height();

    var rangeSlider = $("#slider"),
        aspectSlider = rangeSlider.width() / rangeSlider.height();
    
    var sliderTopYear = $("#sliderYear"),
        aspectSliderTopYear = sliderTopYear.width() / sliderTopYear.height();

    var stackChart = $("#stack_chart_section"),
        aspectStackChart = stackChart.width() / stackChart.height();

    $(window).on("resize", function () {

        var targetWidth = container.width();
        chart.attr("width", targetWidth);
        chart.attr("height", Math.round(targetWidth / aspectChart));

        title.attr("width", targetWidth);
        title.attr("height", Math.round(targetWidth / aspectTitle));


        var sliderWidth = $("#rangeSlider").width();
        rangeSlider.attr("width", sliderWidth);
        rangeSlider.attr("height", Math.round(sliderWidth / aspectSlider));

        sliderTopYear.attr("width", sliderWidth);
        sliderTopYear.attr("height", Math.round(sliderWidth / aspectSliderTopYear));

        stackChart.attr("width", sliderWidth);
        stackChart.attr("height", Math.round(sliderWidth / aspectStackChart));

    }).trigger("resize");

    // console.log(graph_nest);
    // console.log(graphs);
    // console.log(summary);

    setFromCookie();
})();