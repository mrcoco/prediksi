/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 209.0, "minX": 0.0, "maxY": 715.0, "series": [{"data": [[0.0, 209.0], [0.1, 209.0], [0.2, 209.0], [0.3, 209.0], [0.4, 209.0], [0.5, 209.0], [0.6, 209.0], [0.7, 209.0], [0.8, 209.0], [0.9, 209.0], [1.0, 209.0], [1.1, 209.0], [1.2, 209.0], [1.3, 209.0], [1.4, 209.0], [1.5, 209.0], [1.6, 209.0], [1.7, 209.0], [1.8, 209.0], [1.9, 209.0], [2.0, 209.0], [2.1, 209.0], [2.2, 209.0], [2.3, 209.0], [2.4, 209.0], [2.5, 209.0], [2.6, 209.0], [2.7, 209.0], [2.8, 209.0], [2.9, 209.0], [3.0, 209.0], [3.1, 209.0], [3.2, 209.0], [3.3, 209.0], [3.4, 209.0], [3.5, 209.0], [3.6, 209.0], [3.7, 209.0], [3.8, 209.0], [3.9, 209.0], [4.0, 210.0], [4.1, 210.0], [4.2, 210.0], [4.3, 210.0], [4.4, 210.0], [4.5, 210.0], [4.6, 210.0], [4.7, 210.0], [4.8, 210.0], [4.9, 210.0], [5.0, 210.0], [5.1, 210.0], [5.2, 210.0], [5.3, 210.0], [5.4, 210.0], [5.5, 210.0], [5.6, 210.0], [5.7, 210.0], [5.8, 210.0], [5.9, 210.0], [6.0, 211.0], [6.1, 211.0], [6.2, 211.0], [6.3, 211.0], [6.4, 211.0], [6.5, 211.0], [6.6, 211.0], [6.7, 211.0], [6.8, 211.0], [6.9, 211.0], [7.0, 211.0], [7.1, 211.0], [7.2, 211.0], [7.3, 211.0], [7.4, 211.0], [7.5, 211.0], [7.6, 211.0], [7.7, 211.0], [7.8, 211.0], [7.9, 211.0], [8.0, 214.0], [8.1, 214.0], [8.2, 214.0], [8.3, 214.0], [8.4, 214.0], [8.5, 214.0], [8.6, 214.0], [8.7, 214.0], [8.8, 214.0], [8.9, 214.0], [9.0, 214.0], [9.1, 214.0], [9.2, 214.0], [9.3, 214.0], [9.4, 214.0], [9.5, 214.0], [9.6, 214.0], [9.7, 214.0], [9.8, 214.0], [9.9, 214.0], [10.0, 261.0], [10.1, 261.0], [10.2, 261.0], [10.3, 261.0], [10.4, 261.0], [10.5, 261.0], [10.6, 261.0], [10.7, 261.0], [10.8, 261.0], [10.9, 261.0], [11.0, 261.0], [11.1, 261.0], [11.2, 261.0], [11.3, 261.0], [11.4, 261.0], [11.5, 261.0], [11.6, 261.0], [11.7, 261.0], [11.8, 261.0], [11.9, 261.0], [12.0, 281.0], [12.1, 281.0], [12.2, 281.0], [12.3, 281.0], [12.4, 281.0], [12.5, 281.0], [12.6, 281.0], [12.7, 281.0], [12.8, 281.0], [12.9, 281.0], [13.0, 281.0], [13.1, 281.0], [13.2, 281.0], [13.3, 281.0], [13.4, 281.0], [13.5, 281.0], [13.6, 281.0], [13.7, 281.0], [13.8, 281.0], [13.9, 281.0], [14.0, 333.0], [14.1, 333.0], [14.2, 333.0], [14.3, 333.0], [14.4, 333.0], [14.5, 333.0], [14.6, 333.0], [14.7, 333.0], [14.8, 333.0], [14.9, 333.0], [15.0, 333.0], [15.1, 333.0], [15.2, 333.0], [15.3, 333.0], [15.4, 333.0], [15.5, 333.0], [15.6, 333.0], [15.7, 333.0], [15.8, 333.0], [15.9, 333.0], [16.0, 333.0], [16.1, 333.0], [16.2, 333.0], [16.3, 333.0], [16.4, 333.0], [16.5, 333.0], [16.6, 333.0], [16.7, 333.0], [16.8, 333.0], [16.9, 333.0], [17.0, 333.0], [17.1, 333.0], [17.2, 333.0], [17.3, 333.0], [17.4, 333.0], [17.5, 333.0], [17.6, 333.0], [17.7, 333.0], [17.8, 333.0], [17.9, 333.0], [18.0, 334.0], [18.1, 334.0], [18.2, 334.0], [18.3, 334.0], [18.4, 334.0], [18.5, 334.0], [18.6, 334.0], [18.7, 334.0], [18.8, 334.0], [18.9, 334.0], [19.0, 334.0], [19.1, 334.0], [19.2, 334.0], [19.3, 334.0], [19.4, 334.0], [19.5, 334.0], [19.6, 334.0], [19.7, 334.0], [19.8, 334.0], [19.9, 334.0], [20.0, 334.0], [20.1, 334.0], [20.2, 334.0], [20.3, 334.0], [20.4, 334.0], [20.5, 334.0], [20.6, 334.0], [20.7, 334.0], [20.8, 334.0], [20.9, 334.0], [21.0, 334.0], [21.1, 334.0], [21.2, 334.0], [21.3, 334.0], [21.4, 334.0], [21.5, 334.0], [21.6, 334.0], [21.7, 334.0], [21.8, 334.0], [21.9, 334.0], [22.0, 334.0], [22.1, 334.0], [22.2, 334.0], [22.3, 334.0], [22.4, 334.0], [22.5, 334.0], [22.6, 334.0], [22.7, 334.0], [22.8, 334.0], [22.9, 334.0], [23.0, 334.0], [23.1, 334.0], [23.2, 334.0], [23.3, 334.0], [23.4, 334.0], [23.5, 334.0], [23.6, 334.0], [23.7, 334.0], [23.8, 334.0], [23.9, 334.0], [24.0, 334.0], [24.1, 334.0], [24.2, 334.0], [24.3, 334.0], [24.4, 334.0], [24.5, 334.0], [24.6, 334.0], [24.7, 334.0], [24.8, 334.0], [24.9, 334.0], [25.0, 334.0], [25.1, 334.0], [25.2, 334.0], [25.3, 334.0], [25.4, 334.0], [25.5, 334.0], [25.6, 334.0], [25.7, 334.0], [25.8, 334.0], [25.9, 334.0], [26.0, 336.0], [26.1, 336.0], [26.2, 336.0], [26.3, 336.0], [26.4, 336.0], [26.5, 336.0], [26.6, 336.0], [26.7, 336.0], [26.8, 336.0], [26.9, 336.0], [27.0, 336.0], [27.1, 336.0], [27.2, 336.0], [27.3, 336.0], [27.4, 336.0], [27.5, 336.0], [27.6, 336.0], [27.7, 336.0], [27.8, 336.0], [27.9, 336.0], [28.0, 336.0], [28.1, 336.0], [28.2, 336.0], [28.3, 336.0], [28.4, 336.0], [28.5, 336.0], [28.6, 336.0], [28.7, 336.0], [28.8, 336.0], [28.9, 336.0], [29.0, 336.0], [29.1, 336.0], [29.2, 336.0], [29.3, 336.0], [29.4, 336.0], [29.5, 336.0], [29.6, 336.0], [29.7, 336.0], [29.8, 336.0], [29.9, 336.0], [30.0, 350.0], [30.1, 350.0], [30.2, 350.0], [30.3, 350.0], [30.4, 350.0], [30.5, 350.0], [30.6, 350.0], [30.7, 350.0], [30.8, 350.0], [30.9, 350.0], [31.0, 350.0], [31.1, 350.0], [31.2, 350.0], [31.3, 350.0], [31.4, 350.0], [31.5, 350.0], [31.6, 350.0], [31.7, 350.0], [31.8, 350.0], [31.9, 350.0], [32.0, 386.0], [32.1, 386.0], [32.2, 386.0], [32.3, 386.0], [32.4, 386.0], [32.5, 386.0], [32.6, 386.0], [32.7, 386.0], [32.8, 386.0], [32.9, 386.0], [33.0, 386.0], [33.1, 386.0], [33.2, 386.0], [33.3, 386.0], [33.4, 386.0], [33.5, 386.0], [33.6, 386.0], [33.7, 386.0], [33.8, 386.0], [33.9, 386.0], [34.0, 472.0], [34.1, 472.0], [34.2, 472.0], [34.3, 472.0], [34.4, 472.0], [34.5, 472.0], [34.6, 472.0], [34.7, 472.0], [34.8, 472.0], [34.9, 472.0], [35.0, 472.0], [35.1, 472.0], [35.2, 472.0], [35.3, 472.0], [35.4, 472.0], [35.5, 472.0], [35.6, 472.0], [35.7, 472.0], [35.8, 472.0], [35.9, 472.0], [36.0, 480.0], [36.1, 480.0], [36.2, 480.0], [36.3, 480.0], [36.4, 480.0], [36.5, 480.0], [36.6, 480.0], [36.7, 480.0], [36.8, 480.0], [36.9, 480.0], [37.0, 480.0], [37.1, 480.0], [37.2, 480.0], [37.3, 480.0], [37.4, 480.0], [37.5, 480.0], [37.6, 480.0], [37.7, 480.0], [37.8, 480.0], [37.9, 480.0], [38.0, 498.0], [38.1, 498.0], [38.2, 498.0], [38.3, 498.0], [38.4, 498.0], [38.5, 498.0], [38.6, 498.0], [38.7, 498.0], [38.8, 498.0], [38.9, 498.0], [39.0, 498.0], [39.1, 498.0], [39.2, 498.0], [39.3, 498.0], [39.4, 498.0], [39.5, 498.0], [39.6, 498.0], [39.7, 498.0], [39.8, 498.0], [39.9, 498.0], [40.0, 499.0], [40.1, 499.0], [40.2, 499.0], [40.3, 499.0], [40.4, 499.0], [40.5, 499.0], [40.6, 499.0], [40.7, 499.0], [40.8, 499.0], [40.9, 499.0], [41.0, 499.0], [41.1, 499.0], [41.2, 499.0], [41.3, 499.0], [41.4, 499.0], [41.5, 499.0], [41.6, 499.0], [41.7, 499.0], [41.8, 499.0], [41.9, 499.0], [42.0, 499.0], [42.1, 499.0], [42.2, 499.0], [42.3, 499.0], [42.4, 499.0], [42.5, 499.0], [42.6, 499.0], [42.7, 499.0], [42.8, 499.0], [42.9, 499.0], [43.0, 499.0], [43.1, 499.0], [43.2, 499.0], [43.3, 499.0], [43.4, 499.0], [43.5, 499.0], [43.6, 499.0], [43.7, 499.0], [43.8, 499.0], [43.9, 499.0], [44.0, 499.0], [44.1, 499.0], [44.2, 499.0], [44.3, 499.0], [44.4, 499.0], [44.5, 499.0], [44.6, 499.0], [44.7, 499.0], [44.8, 499.0], [44.9, 499.0], [45.0, 499.0], [45.1, 499.0], [45.2, 499.0], [45.3, 499.0], [45.4, 499.0], [45.5, 499.0], [45.6, 499.0], [45.7, 499.0], [45.8, 499.0], [45.9, 499.0], [46.0, 500.0], [46.1, 500.0], [46.2, 500.0], [46.3, 500.0], [46.4, 500.0], [46.5, 500.0], [46.6, 500.0], [46.7, 500.0], [46.8, 500.0], [46.9, 500.0], [47.0, 500.0], [47.1, 500.0], [47.2, 500.0], [47.3, 500.0], [47.4, 500.0], [47.5, 500.0], [47.6, 500.0], [47.7, 500.0], [47.8, 500.0], [47.9, 500.0], [48.0, 501.0], [48.1, 501.0], [48.2, 501.0], [48.3, 501.0], [48.4, 501.0], [48.5, 501.0], [48.6, 501.0], [48.7, 501.0], [48.8, 501.0], [48.9, 501.0], [49.0, 501.0], [49.1, 501.0], [49.2, 501.0], [49.3, 501.0], [49.4, 501.0], [49.5, 501.0], [49.6, 501.0], [49.7, 501.0], [49.8, 501.0], [49.9, 501.0], [50.0, 501.0], [50.1, 501.0], [50.2, 501.0], [50.3, 501.0], [50.4, 501.0], [50.5, 501.0], [50.6, 501.0], [50.7, 501.0], [50.8, 501.0], [50.9, 501.0], [51.0, 501.0], [51.1, 501.0], [51.2, 501.0], [51.3, 501.0], [51.4, 501.0], [51.5, 501.0], [51.6, 501.0], [51.7, 501.0], [51.8, 501.0], [51.9, 501.0], [52.0, 502.0], [52.1, 502.0], [52.2, 502.0], [52.3, 502.0], [52.4, 502.0], [52.5, 502.0], [52.6, 502.0], [52.7, 502.0], [52.8, 502.0], [52.9, 502.0], [53.0, 502.0], [53.1, 502.0], [53.2, 502.0], [53.3, 502.0], [53.4, 502.0], [53.5, 502.0], [53.6, 502.0], [53.7, 502.0], [53.8, 502.0], [53.9, 502.0], [54.0, 504.0], [54.1, 504.0], [54.2, 504.0], [54.3, 504.0], [54.4, 504.0], [54.5, 504.0], [54.6, 504.0], [54.7, 504.0], [54.8, 504.0], [54.9, 504.0], [55.0, 504.0], [55.1, 504.0], [55.2, 504.0], [55.3, 504.0], [55.4, 504.0], [55.5, 504.0], [55.6, 504.0], [55.7, 504.0], [55.8, 504.0], [55.9, 504.0], [56.0, 504.0], [56.1, 504.0], [56.2, 504.0], [56.3, 504.0], [56.4, 504.0], [56.5, 504.0], [56.6, 504.0], [56.7, 504.0], [56.8, 504.0], [56.9, 504.0], [57.0, 504.0], [57.1, 504.0], [57.2, 504.0], [57.3, 504.0], [57.4, 504.0], [57.5, 504.0], [57.6, 504.0], [57.7, 504.0], [57.8, 504.0], [57.9, 504.0], [58.0, 504.0], [58.1, 504.0], [58.2, 504.0], [58.3, 504.0], [58.4, 504.0], [58.5, 504.0], [58.6, 504.0], [58.7, 504.0], [58.8, 504.0], [58.9, 504.0], [59.0, 504.0], [59.1, 504.0], [59.2, 504.0], [59.3, 504.0], [59.4, 504.0], [59.5, 504.0], [59.6, 504.0], [59.7, 504.0], [59.8, 504.0], [59.9, 504.0], [60.0, 504.0], [60.1, 504.0], [60.2, 504.0], [60.3, 504.0], [60.4, 504.0], [60.5, 504.0], [60.6, 504.0], [60.7, 504.0], [60.8, 504.0], [60.9, 504.0], [61.0, 504.0], [61.1, 504.0], [61.2, 504.0], [61.3, 504.0], [61.4, 504.0], [61.5, 504.0], [61.6, 504.0], [61.7, 504.0], [61.8, 504.0], [61.9, 504.0], [62.0, 505.0], [62.1, 505.0], [62.2, 505.0], [62.3, 505.0], [62.4, 505.0], [62.5, 505.0], [62.6, 505.0], [62.7, 505.0], [62.8, 505.0], [62.9, 505.0], [63.0, 505.0], [63.1, 505.0], [63.2, 505.0], [63.3, 505.0], [63.4, 505.0], [63.5, 505.0], [63.6, 505.0], [63.7, 505.0], [63.8, 505.0], [63.9, 505.0], [64.0, 505.0], [64.1, 505.0], [64.2, 505.0], [64.3, 505.0], [64.4, 505.0], [64.5, 505.0], [64.6, 505.0], [64.7, 505.0], [64.8, 505.0], [64.9, 505.0], [65.0, 505.0], [65.1, 505.0], [65.2, 505.0], [65.3, 505.0], [65.4, 505.0], [65.5, 505.0], [65.6, 505.0], [65.7, 505.0], [65.8, 505.0], [65.9, 505.0], [66.0, 506.0], [66.1, 506.0], [66.2, 506.0], [66.3, 506.0], [66.4, 506.0], [66.5, 506.0], [66.6, 506.0], [66.7, 506.0], [66.8, 506.0], [66.9, 506.0], [67.0, 506.0], [67.1, 506.0], [67.2, 506.0], [67.3, 506.0], [67.4, 506.0], [67.5, 506.0], [67.6, 506.0], [67.7, 506.0], [67.8, 506.0], [67.9, 506.0], [68.0, 506.0], [68.1, 506.0], [68.2, 506.0], [68.3, 506.0], [68.4, 506.0], [68.5, 506.0], [68.6, 506.0], [68.7, 506.0], [68.8, 506.0], [68.9, 506.0], [69.0, 506.0], [69.1, 506.0], [69.2, 506.0], [69.3, 506.0], [69.4, 506.0], [69.5, 506.0], [69.6, 506.0], [69.7, 506.0], [69.8, 506.0], [69.9, 506.0], [70.0, 508.0], [70.1, 508.0], [70.2, 508.0], [70.3, 508.0], [70.4, 508.0], [70.5, 508.0], [70.6, 508.0], [70.7, 508.0], [70.8, 508.0], [70.9, 508.0], [71.0, 508.0], [71.1, 508.0], [71.2, 508.0], [71.3, 508.0], [71.4, 508.0], [71.5, 508.0], [71.6, 508.0], [71.7, 508.0], [71.8, 508.0], [71.9, 508.0], [72.0, 509.0], [72.1, 509.0], [72.2, 509.0], [72.3, 509.0], [72.4, 509.0], [72.5, 509.0], [72.6, 509.0], [72.7, 509.0], [72.8, 509.0], [72.9, 509.0], [73.0, 509.0], [73.1, 509.0], [73.2, 509.0], [73.3, 509.0], [73.4, 509.0], [73.5, 509.0], [73.6, 509.0], [73.7, 509.0], [73.8, 509.0], [73.9, 509.0], [74.0, 540.0], [74.1, 540.0], [74.2, 540.0], [74.3, 540.0], [74.4, 540.0], [74.5, 540.0], [74.6, 540.0], [74.7, 540.0], [74.8, 540.0], [74.9, 540.0], [75.0, 540.0], [75.1, 540.0], [75.2, 540.0], [75.3, 540.0], [75.4, 540.0], [75.5, 540.0], [75.6, 540.0], [75.7, 540.0], [75.8, 540.0], [75.9, 540.0], [76.0, 542.0], [76.1, 542.0], [76.2, 542.0], [76.3, 542.0], [76.4, 542.0], [76.5, 542.0], [76.6, 542.0], [76.7, 542.0], [76.8, 542.0], [76.9, 542.0], [77.0, 542.0], [77.1, 542.0], [77.2, 542.0], [77.3, 542.0], [77.4, 542.0], [77.5, 542.0], [77.6, 542.0], [77.7, 542.0], [77.8, 542.0], [77.9, 542.0], [78.0, 647.0], [78.1, 647.0], [78.2, 647.0], [78.3, 647.0], [78.4, 647.0], [78.5, 647.0], [78.6, 647.0], [78.7, 647.0], [78.8, 647.0], [78.9, 647.0], [79.0, 647.0], [79.1, 647.0], [79.2, 647.0], [79.3, 647.0], [79.4, 647.0], [79.5, 647.0], [79.6, 647.0], [79.7, 647.0], [79.8, 647.0], [79.9, 647.0], [80.0, 667.0], [80.1, 667.0], [80.2, 667.0], [80.3, 667.0], [80.4, 667.0], [80.5, 667.0], [80.6, 667.0], [80.7, 667.0], [80.8, 667.0], [80.9, 667.0], [81.0, 667.0], [81.1, 667.0], [81.2, 667.0], [81.3, 667.0], [81.4, 667.0], [81.5, 667.0], [81.6, 667.0], [81.7, 667.0], [81.8, 667.0], [81.9, 667.0], [82.0, 667.0], [82.1, 667.0], [82.2, 667.0], [82.3, 667.0], [82.4, 667.0], [82.5, 667.0], [82.6, 667.0], [82.7, 667.0], [82.8, 667.0], [82.9, 667.0], [83.0, 667.0], [83.1, 667.0], [83.2, 667.0], [83.3, 667.0], [83.4, 667.0], [83.5, 667.0], [83.6, 667.0], [83.7, 667.0], [83.8, 667.0], [83.9, 667.0], [84.0, 669.0], [84.1, 669.0], [84.2, 669.0], [84.3, 669.0], [84.4, 669.0], [84.5, 669.0], [84.6, 669.0], [84.7, 669.0], [84.8, 669.0], [84.9, 669.0], [85.0, 669.0], [85.1, 669.0], [85.2, 669.0], [85.3, 669.0], [85.4, 669.0], [85.5, 669.0], [85.6, 669.0], [85.7, 669.0], [85.8, 669.0], [85.9, 669.0], [86.0, 671.0], [86.1, 671.0], [86.2, 671.0], [86.3, 671.0], [86.4, 671.0], [86.5, 671.0], [86.6, 671.0], [86.7, 671.0], [86.8, 671.0], [86.9, 671.0], [87.0, 671.0], [87.1, 671.0], [87.2, 671.0], [87.3, 671.0], [87.4, 671.0], [87.5, 671.0], [87.6, 671.0], [87.7, 671.0], [87.8, 671.0], [87.9, 671.0], [88.0, 671.0], [88.1, 671.0], [88.2, 671.0], [88.3, 671.0], [88.4, 671.0], [88.5, 671.0], [88.6, 671.0], [88.7, 671.0], [88.8, 671.0], [88.9, 671.0], [89.0, 671.0], [89.1, 671.0], [89.2, 671.0], [89.3, 671.0], [89.4, 671.0], [89.5, 671.0], [89.6, 671.0], [89.7, 671.0], [89.8, 671.0], [89.9, 671.0], [90.0, 671.0], [90.1, 671.0], [90.2, 671.0], [90.3, 671.0], [90.4, 671.0], [90.5, 671.0], [90.6, 671.0], [90.7, 671.0], [90.8, 671.0], [90.9, 671.0], [91.0, 671.0], [91.1, 671.0], [91.2, 671.0], [91.3, 671.0], [91.4, 671.0], [91.5, 671.0], [91.6, 671.0], [91.7, 671.0], [91.8, 671.0], [91.9, 671.0], [92.0, 675.0], [92.1, 675.0], [92.2, 675.0], [92.3, 675.0], [92.4, 675.0], [92.5, 675.0], [92.6, 675.0], [92.7, 675.0], [92.8, 675.0], [92.9, 675.0], [93.0, 675.0], [93.1, 675.0], [93.2, 675.0], [93.3, 675.0], [93.4, 675.0], [93.5, 675.0], [93.6, 675.0], [93.7, 675.0], [93.8, 675.0], [93.9, 675.0], [94.0, 676.0], [94.1, 676.0], [94.2, 676.0], [94.3, 676.0], [94.4, 676.0], [94.5, 676.0], [94.6, 676.0], [94.7, 676.0], [94.8, 676.0], [94.9, 676.0], [95.0, 676.0], [95.1, 676.0], [95.2, 676.0], [95.3, 676.0], [95.4, 676.0], [95.5, 676.0], [95.6, 676.0], [95.7, 676.0], [95.8, 676.0], [95.9, 676.0], [96.0, 678.0], [96.1, 678.0], [96.2, 678.0], [96.3, 678.0], [96.4, 678.0], [96.5, 678.0], [96.6, 678.0], [96.7, 678.0], [96.8, 678.0], [96.9, 678.0], [97.0, 678.0], [97.1, 678.0], [97.2, 678.0], [97.3, 678.0], [97.4, 678.0], [97.5, 678.0], [97.6, 678.0], [97.7, 678.0], [97.8, 678.0], [97.9, 678.0], [98.0, 715.0], [98.1, 715.0], [98.2, 715.0], [98.3, 715.0], [98.4, 715.0], [98.5, 715.0], [98.6, 715.0], [98.7, 715.0], [98.8, 715.0], [98.9, 715.0], [99.0, 715.0], [99.1, 715.0], [99.2, 715.0], [99.3, 715.0], [99.4, 715.0], [99.5, 715.0], [99.6, 715.0], [99.7, 715.0], [99.8, 715.0], [99.9, 715.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 200.0, "maxY": 16.0, "series": [{"data": [[300.0, 10.0], [600.0, 10.0], [700.0, 1.0], [200.0, 7.0], [400.0, 6.0], [500.0, 16.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 700.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 24.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 26.0, "series": [{"data": [[0.0, 24.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 26.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 1.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 2.82, "minX": 1.75107834E12, "maxY": 2.82, "series": [{"data": [[1.75107834E12, 2.82]], "isOverall": false, "label": "Auth Test Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107834E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 240.0, "minX": 1.0, "maxY": 601.6153846153845, "series": [{"data": [[1.0, 240.0], [2.0, 357.1], [4.0, 601.6153846153845], [3.0, 507.99999999999994]], "isOverall": false, "label": "Login Request", "isController": false}, {"data": [[2.82, 470.0]], "isOverall": false, "label": "Login Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 4.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 189.16666666666666, "minX": 1.75107834E12, "maxY": 448.3333333333333, "series": [{"data": [[1.75107834E12, 448.3333333333333]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.75107834E12, 189.16666666666666]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107834E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 470.0, "minX": 1.75107834E12, "maxY": 470.0, "series": [{"data": [[1.75107834E12, 470.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107834E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 469.90000000000003, "minX": 1.75107834E12, "maxY": 469.90000000000003, "series": [{"data": [[1.75107834E12, 469.90000000000003]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107834E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.24000000000000005, "minX": 1.75107834E12, "maxY": 0.24000000000000005, "series": [{"data": [[1.75107834E12, 0.24000000000000005]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107834E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 209.0, "minX": 1.75107834E12, "maxY": 715.0, "series": [{"data": [[1.75107834E12, 715.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.75107834E12, 209.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.75107834E12, 671.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.75107834E12, 715.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.75107834E12, 501.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.75107834E12, 676.9]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107834E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 271.0, "minX": 4.0, "maxY": 505.0, "series": [{"data": [[4.0, 333.5], [5.0, 271.0], [6.0, 505.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 268.5, "minX": 4.0, "maxY": 505.0, "series": [{"data": [[4.0, 333.5], [5.0, 268.5], [6.0, 505.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 0.8333333333333334, "minX": 1.75107834E12, "maxY": 0.8333333333333334, "series": [{"data": [[1.75107834E12, 0.8333333333333334]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107834E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 0.8333333333333334, "minX": 1.75107834E12, "maxY": 0.8333333333333334, "series": [{"data": [[1.75107834E12, 0.8333333333333334]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107834E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 0.8333333333333334, "minX": 1.75107834E12, "maxY": 0.8333333333333334, "series": [{"data": [[1.75107834E12, 0.8333333333333334]], "isOverall": false, "label": "Login Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107834E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 0.8333333333333334, "minX": 1.75107834E12, "maxY": 0.8333333333333334, "series": [{"data": [[1.75107834E12, 0.8333333333333334]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107834E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 25200000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

