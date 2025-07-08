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
        data: {"result": {"minY": 210.0, "minX": 0.0, "maxY": 1568.0, "series": [{"data": [[0.0, 210.0], [0.1, 210.0], [0.2, 210.0], [0.3, 210.0], [0.4, 210.0], [0.5, 210.0], [0.6, 210.0], [0.7, 210.0], [0.8, 210.0], [0.9, 210.0], [1.0, 210.0], [1.1, 210.0], [1.2, 210.0], [1.3, 210.0], [1.4, 210.0], [1.5, 210.0], [1.6, 210.0], [1.7, 210.0], [1.8, 210.0], [1.9, 210.0], [2.0, 213.0], [2.1, 213.0], [2.2, 213.0], [2.3, 213.0], [2.4, 213.0], [2.5, 213.0], [2.6, 213.0], [2.7, 213.0], [2.8, 213.0], [2.9, 213.0], [3.0, 213.0], [3.1, 213.0], [3.2, 213.0], [3.3, 213.0], [3.4, 213.0], [3.5, 213.0], [3.6, 213.0], [3.7, 213.0], [3.8, 213.0], [3.9, 213.0], [4.0, 223.0], [4.1, 223.0], [4.2, 223.0], [4.3, 223.0], [4.4, 223.0], [4.5, 223.0], [4.6, 223.0], [4.7, 223.0], [4.8, 223.0], [4.9, 223.0], [5.0, 244.0], [5.1, 244.0], [5.2, 244.0], [5.3, 244.0], [5.4, 244.0], [5.5, 244.0], [5.6, 244.0], [5.7, 244.0], [5.8, 244.0], [5.9, 244.0], [6.0, 330.0], [6.1, 330.0], [6.2, 330.0], [6.3, 330.0], [6.4, 330.0], [6.5, 330.0], [6.6, 330.0], [6.7, 330.0], [6.8, 330.0], [6.9, 330.0], [7.0, 331.0], [7.1, 331.0], [7.2, 331.0], [7.3, 331.0], [7.4, 331.0], [7.5, 331.0], [7.6, 331.0], [7.7, 331.0], [7.8, 331.0], [7.9, 331.0], [8.0, 332.0], [8.1, 332.0], [8.2, 332.0], [8.3, 332.0], [8.4, 332.0], [8.5, 332.0], [8.6, 332.0], [8.7, 332.0], [8.8, 332.0], [8.9, 332.0], [9.0, 332.0], [9.1, 332.0], [9.2, 332.0], [9.3, 332.0], [9.4, 332.0], [9.5, 332.0], [9.6, 332.0], [9.7, 332.0], [9.8, 332.0], [9.9, 332.0], [10.0, 333.0], [10.1, 333.0], [10.2, 333.0], [10.3, 333.0], [10.4, 333.0], [10.5, 333.0], [10.6, 333.0], [10.7, 333.0], [10.8, 333.0], [10.9, 333.0], [11.0, 334.0], [11.1, 334.0], [11.2, 334.0], [11.3, 334.0], [11.4, 334.0], [11.5, 334.0], [11.6, 334.0], [11.7, 334.0], [11.8, 334.0], [11.9, 334.0], [12.0, 338.0], [12.1, 338.0], [12.2, 338.0], [12.3, 338.0], [12.4, 338.0], [12.5, 338.0], [12.6, 338.0], [12.7, 338.0], [12.8, 338.0], [12.9, 338.0], [13.0, 352.0], [13.1, 352.0], [13.2, 352.0], [13.3, 352.0], [13.4, 352.0], [13.5, 352.0], [13.6, 352.0], [13.7, 352.0], [13.8, 352.0], [13.9, 352.0], [14.0, 386.0], [14.1, 386.0], [14.2, 386.0], [14.3, 386.0], [14.4, 386.0], [14.5, 386.0], [14.6, 386.0], [14.7, 386.0], [14.8, 386.0], [14.9, 386.0], [15.0, 428.0], [15.1, 428.0], [15.2, 428.0], [15.3, 428.0], [15.4, 428.0], [15.5, 428.0], [15.6, 428.0], [15.7, 428.0], [15.8, 428.0], [15.9, 428.0], [16.0, 494.0], [16.1, 494.0], [16.2, 494.0], [16.3, 494.0], [16.4, 494.0], [16.5, 494.0], [16.6, 494.0], [16.7, 494.0], [16.8, 494.0], [16.9, 494.0], [17.0, 495.0], [17.1, 495.0], [17.2, 495.0], [17.3, 495.0], [17.4, 495.0], [17.5, 495.0], [17.6, 495.0], [17.7, 495.0], [17.8, 495.0], [17.9, 495.0], [18.0, 495.0], [18.1, 495.0], [18.2, 495.0], [18.3, 495.0], [18.4, 495.0], [18.5, 495.0], [18.6, 495.0], [18.7, 495.0], [18.8, 495.0], [18.9, 495.0], [19.0, 496.0], [19.1, 496.0], [19.2, 496.0], [19.3, 496.0], [19.4, 496.0], [19.5, 496.0], [19.6, 496.0], [19.7, 496.0], [19.8, 496.0], [19.9, 496.0], [20.0, 496.0], [20.1, 496.0], [20.2, 496.0], [20.3, 496.0], [20.4, 496.0], [20.5, 496.0], [20.6, 496.0], [20.7, 496.0], [20.8, 496.0], [20.9, 496.0], [21.0, 496.0], [21.1, 496.0], [21.2, 496.0], [21.3, 496.0], [21.4, 496.0], [21.5, 496.0], [21.6, 496.0], [21.7, 496.0], [21.8, 496.0], [21.9, 496.0], [22.0, 497.0], [22.1, 497.0], [22.2, 497.0], [22.3, 497.0], [22.4, 497.0], [22.5, 497.0], [22.6, 497.0], [22.7, 497.0], [22.8, 497.0], [22.9, 497.0], [23.0, 498.0], [23.1, 498.0], [23.2, 498.0], [23.3, 498.0], [23.4, 498.0], [23.5, 498.0], [23.6, 498.0], [23.7, 498.0], [23.8, 498.0], [23.9, 498.0], [24.0, 498.0], [24.1, 498.0], [24.2, 498.0], [24.3, 498.0], [24.4, 498.0], [24.5, 498.0], [24.6, 498.0], [24.7, 498.0], [24.8, 498.0], [24.9, 498.0], [25.0, 499.0], [25.1, 499.0], [25.2, 499.0], [25.3, 499.0], [25.4, 499.0], [25.5, 499.0], [25.6, 499.0], [25.7, 499.0], [25.8, 499.0], [25.9, 499.0], [26.0, 499.0], [26.1, 499.0], [26.2, 499.0], [26.3, 499.0], [26.4, 499.0], [26.5, 499.0], [26.6, 499.0], [26.7, 499.0], [26.8, 499.0], [26.9, 499.0], [27.0, 501.0], [27.1, 501.0], [27.2, 501.0], [27.3, 501.0], [27.4, 501.0], [27.5, 501.0], [27.6, 501.0], [27.7, 501.0], [27.8, 501.0], [27.9, 501.0], [28.0, 502.0], [28.1, 502.0], [28.2, 502.0], [28.3, 502.0], [28.4, 502.0], [28.5, 502.0], [28.6, 502.0], [28.7, 502.0], [28.8, 502.0], [28.9, 502.0], [29.0, 536.0], [29.1, 536.0], [29.2, 536.0], [29.3, 536.0], [29.4, 536.0], [29.5, 536.0], [29.6, 536.0], [29.7, 536.0], [29.8, 536.0], [29.9, 536.0], [30.0, 538.0], [30.1, 538.0], [30.2, 538.0], [30.3, 538.0], [30.4, 538.0], [30.5, 538.0], [30.6, 538.0], [30.7, 538.0], [30.8, 538.0], [30.9, 538.0], [31.0, 587.0], [31.1, 587.0], [31.2, 587.0], [31.3, 587.0], [31.4, 587.0], [31.5, 587.0], [31.6, 587.0], [31.7, 587.0], [31.8, 587.0], [31.9, 587.0], [32.0, 595.0], [32.1, 595.0], [32.2, 595.0], [32.3, 595.0], [32.4, 595.0], [32.5, 595.0], [32.6, 595.0], [32.7, 595.0], [32.8, 595.0], [32.9, 595.0], [33.0, 661.0], [33.1, 661.0], [33.2, 661.0], [33.3, 661.0], [33.4, 661.0], [33.5, 661.0], [33.6, 661.0], [33.7, 661.0], [33.8, 661.0], [33.9, 661.0], [34.0, 661.0], [34.1, 661.0], [34.2, 661.0], [34.3, 661.0], [34.4, 661.0], [34.5, 661.0], [34.6, 661.0], [34.7, 661.0], [34.8, 661.0], [34.9, 661.0], [35.0, 661.0], [35.1, 661.0], [35.2, 661.0], [35.3, 661.0], [35.4, 661.0], [35.5, 661.0], [35.6, 661.0], [35.7, 661.0], [35.8, 661.0], [35.9, 661.0], [36.0, 662.0], [36.1, 662.0], [36.2, 662.0], [36.3, 662.0], [36.4, 662.0], [36.5, 662.0], [36.6, 662.0], [36.7, 662.0], [36.8, 662.0], [36.9, 662.0], [37.0, 663.0], [37.1, 663.0], [37.2, 663.0], [37.3, 663.0], [37.4, 663.0], [37.5, 663.0], [37.6, 663.0], [37.7, 663.0], [37.8, 663.0], [37.9, 663.0], [38.0, 663.0], [38.1, 663.0], [38.2, 663.0], [38.3, 663.0], [38.4, 663.0], [38.5, 663.0], [38.6, 663.0], [38.7, 663.0], [38.8, 663.0], [38.9, 663.0], [39.0, 665.0], [39.1, 665.0], [39.2, 665.0], [39.3, 665.0], [39.4, 665.0], [39.5, 665.0], [39.6, 665.0], [39.7, 665.0], [39.8, 665.0], [39.9, 665.0], [40.0, 666.0], [40.1, 666.0], [40.2, 666.0], [40.3, 666.0], [40.4, 666.0], [40.5, 666.0], [40.6, 666.0], [40.7, 666.0], [40.8, 666.0], [40.9, 666.0], [41.0, 667.0], [41.1, 667.0], [41.2, 667.0], [41.3, 667.0], [41.4, 667.0], [41.5, 667.0], [41.6, 667.0], [41.7, 667.0], [41.8, 667.0], [41.9, 667.0], [42.0, 667.0], [42.1, 667.0], [42.2, 667.0], [42.3, 667.0], [42.4, 667.0], [42.5, 667.0], [42.6, 667.0], [42.7, 667.0], [42.8, 667.0], [42.9, 667.0], [43.0, 668.0], [43.1, 668.0], [43.2, 668.0], [43.3, 668.0], [43.4, 668.0], [43.5, 668.0], [43.6, 668.0], [43.7, 668.0], [43.8, 668.0], [43.9, 668.0], [44.0, 701.0], [44.1, 701.0], [44.2, 701.0], [44.3, 701.0], [44.4, 701.0], [44.5, 701.0], [44.6, 701.0], [44.7, 701.0], [44.8, 701.0], [44.9, 701.0], [45.0, 708.0], [45.1, 708.0], [45.2, 708.0], [45.3, 708.0], [45.4, 708.0], [45.5, 708.0], [45.6, 708.0], [45.7, 708.0], [45.8, 708.0], [45.9, 708.0], [46.0, 752.0], [46.1, 752.0], [46.2, 752.0], [46.3, 752.0], [46.4, 752.0], [46.5, 752.0], [46.6, 752.0], [46.7, 752.0], [46.8, 752.0], [46.9, 752.0], [47.0, 826.0], [47.1, 826.0], [47.2, 826.0], [47.3, 826.0], [47.4, 826.0], [47.5, 826.0], [47.6, 826.0], [47.7, 826.0], [47.8, 826.0], [47.9, 826.0], [48.0, 826.0], [48.1, 826.0], [48.2, 826.0], [48.3, 826.0], [48.4, 826.0], [48.5, 826.0], [48.6, 826.0], [48.7, 826.0], [48.8, 826.0], [48.9, 826.0], [49.0, 826.0], [49.1, 826.0], [49.2, 826.0], [49.3, 826.0], [49.4, 826.0], [49.5, 826.0], [49.6, 826.0], [49.7, 826.0], [49.8, 826.0], [49.9, 826.0], [50.0, 826.0], [50.1, 826.0], [50.2, 826.0], [50.3, 826.0], [50.4, 826.0], [50.5, 826.0], [50.6, 826.0], [50.7, 826.0], [50.8, 826.0], [50.9, 826.0], [51.0, 827.0], [51.1, 827.0], [51.2, 827.0], [51.3, 827.0], [51.4, 827.0], [51.5, 827.0], [51.6, 827.0], [51.7, 827.0], [51.8, 827.0], [51.9, 827.0], [52.0, 829.0], [52.1, 829.0], [52.2, 829.0], [52.3, 829.0], [52.4, 829.0], [52.5, 829.0], [52.6, 829.0], [52.7, 829.0], [52.8, 829.0], [52.9, 829.0], [53.0, 830.0], [53.1, 830.0], [53.2, 830.0], [53.3, 830.0], [53.4, 830.0], [53.5, 830.0], [53.6, 830.0], [53.7, 830.0], [53.8, 830.0], [53.9, 830.0], [54.0, 830.0], [54.1, 830.0], [54.2, 830.0], [54.3, 830.0], [54.4, 830.0], [54.5, 830.0], [54.6, 830.0], [54.7, 830.0], [54.8, 830.0], [54.9, 830.0], [55.0, 831.0], [55.1, 831.0], [55.2, 831.0], [55.3, 831.0], [55.4, 831.0], [55.5, 831.0], [55.6, 831.0], [55.7, 831.0], [55.8, 831.0], [55.9, 831.0], [56.0, 835.0], [56.1, 835.0], [56.2, 835.0], [56.3, 835.0], [56.4, 835.0], [56.5, 835.0], [56.6, 835.0], [56.7, 835.0], [56.8, 835.0], [56.9, 835.0], [57.0, 835.0], [57.1, 835.0], [57.2, 835.0], [57.3, 835.0], [57.4, 835.0], [57.5, 835.0], [57.6, 835.0], [57.7, 835.0], [57.8, 835.0], [57.9, 835.0], [58.0, 840.0], [58.1, 840.0], [58.2, 840.0], [58.3, 840.0], [58.4, 840.0], [58.5, 840.0], [58.6, 840.0], [58.7, 840.0], [58.8, 840.0], [58.9, 840.0], [59.0, 846.0], [59.1, 846.0], [59.2, 846.0], [59.3, 846.0], [59.4, 846.0], [59.5, 846.0], [59.6, 846.0], [59.7, 846.0], [59.8, 846.0], [59.9, 846.0], [60.0, 848.0], [60.1, 848.0], [60.2, 848.0], [60.3, 848.0], [60.4, 848.0], [60.5, 848.0], [60.6, 848.0], [60.7, 848.0], [60.8, 848.0], [60.9, 848.0], [61.0, 849.0], [61.1, 849.0], [61.2, 849.0], [61.3, 849.0], [61.4, 849.0], [61.5, 849.0], [61.6, 849.0], [61.7, 849.0], [61.8, 849.0], [61.9, 849.0], [62.0, 849.0], [62.1, 849.0], [62.2, 849.0], [62.3, 849.0], [62.4, 849.0], [62.5, 849.0], [62.6, 849.0], [62.7, 849.0], [62.8, 849.0], [62.9, 849.0], [63.0, 867.0], [63.1, 867.0], [63.2, 867.0], [63.3, 867.0], [63.4, 867.0], [63.5, 867.0], [63.6, 867.0], [63.7, 867.0], [63.8, 867.0], [63.9, 867.0], [64.0, 910.0], [64.1, 910.0], [64.2, 910.0], [64.3, 910.0], [64.4, 910.0], [64.5, 910.0], [64.6, 910.0], [64.7, 910.0], [64.8, 910.0], [64.9, 910.0], [65.0, 918.0], [65.1, 918.0], [65.2, 918.0], [65.3, 918.0], [65.4, 918.0], [65.5, 918.0], [65.6, 918.0], [65.7, 918.0], [65.8, 918.0], [65.9, 918.0], [66.0, 991.0], [66.1, 991.0], [66.2, 991.0], [66.3, 991.0], [66.4, 991.0], [66.5, 991.0], [66.6, 991.0], [66.7, 991.0], [66.8, 991.0], [66.9, 991.0], [67.0, 992.0], [67.1, 992.0], [67.2, 992.0], [67.3, 992.0], [67.4, 992.0], [67.5, 992.0], [67.6, 992.0], [67.7, 992.0], [67.8, 992.0], [67.9, 992.0], [68.0, 992.0], [68.1, 992.0], [68.2, 992.0], [68.3, 992.0], [68.4, 992.0], [68.5, 992.0], [68.6, 992.0], [68.7, 992.0], [68.8, 992.0], [68.9, 992.0], [69.0, 993.0], [69.1, 993.0], [69.2, 993.0], [69.3, 993.0], [69.4, 993.0], [69.5, 993.0], [69.6, 993.0], [69.7, 993.0], [69.8, 993.0], [69.9, 993.0], [70.0, 993.0], [70.1, 993.0], [70.2, 993.0], [70.3, 993.0], [70.4, 993.0], [70.5, 993.0], [70.6, 993.0], [70.7, 993.0], [70.8, 993.0], [70.9, 993.0], [71.0, 993.0], [71.1, 993.0], [71.2, 993.0], [71.3, 993.0], [71.4, 993.0], [71.5, 993.0], [71.6, 993.0], [71.7, 993.0], [71.8, 993.0], [71.9, 993.0], [72.0, 993.0], [72.1, 993.0], [72.2, 993.0], [72.3, 993.0], [72.4, 993.0], [72.5, 993.0], [72.6, 993.0], [72.7, 993.0], [72.8, 993.0], [72.9, 993.0], [73.0, 993.0], [73.1, 993.0], [73.2, 993.0], [73.3, 993.0], [73.4, 993.0], [73.5, 993.0], [73.6, 993.0], [73.7, 993.0], [73.8, 993.0], [73.9, 993.0], [74.0, 994.0], [74.1, 994.0], [74.2, 994.0], [74.3, 994.0], [74.4, 994.0], [74.5, 994.0], [74.6, 994.0], [74.7, 994.0], [74.8, 994.0], [74.9, 994.0], [75.0, 994.0], [75.1, 994.0], [75.2, 994.0], [75.3, 994.0], [75.4, 994.0], [75.5, 994.0], [75.6, 994.0], [75.7, 994.0], [75.8, 994.0], [75.9, 994.0], [76.0, 995.0], [76.1, 995.0], [76.2, 995.0], [76.3, 995.0], [76.4, 995.0], [76.5, 995.0], [76.6, 995.0], [76.7, 995.0], [76.8, 995.0], [76.9, 995.0], [77.0, 995.0], [77.1, 995.0], [77.2, 995.0], [77.3, 995.0], [77.4, 995.0], [77.5, 995.0], [77.6, 995.0], [77.7, 995.0], [77.8, 995.0], [77.9, 995.0], [78.0, 995.0], [78.1, 995.0], [78.2, 995.0], [78.3, 995.0], [78.4, 995.0], [78.5, 995.0], [78.6, 995.0], [78.7, 995.0], [78.8, 995.0], [78.9, 995.0], [79.0, 995.0], [79.1, 995.0], [79.2, 995.0], [79.3, 995.0], [79.4, 995.0], [79.5, 995.0], [79.6, 995.0], [79.7, 995.0], [79.8, 995.0], [79.9, 995.0], [80.0, 996.0], [80.1, 996.0], [80.2, 996.0], [80.3, 996.0], [80.4, 996.0], [80.5, 996.0], [80.6, 996.0], [80.7, 996.0], [80.8, 996.0], [80.9, 996.0], [81.0, 996.0], [81.1, 996.0], [81.2, 996.0], [81.3, 996.0], [81.4, 996.0], [81.5, 996.0], [81.6, 996.0], [81.7, 996.0], [81.8, 996.0], [81.9, 996.0], [82.0, 996.0], [82.1, 996.0], [82.2, 996.0], [82.3, 996.0], [82.4, 996.0], [82.5, 996.0], [82.6, 996.0], [82.7, 996.0], [82.8, 996.0], [82.9, 996.0], [83.0, 1037.0], [83.1, 1037.0], [83.2, 1037.0], [83.3, 1037.0], [83.4, 1037.0], [83.5, 1037.0], [83.6, 1037.0], [83.7, 1037.0], [83.8, 1037.0], [83.9, 1037.0], [84.0, 1065.0], [84.1, 1065.0], [84.2, 1065.0], [84.3, 1065.0], [84.4, 1065.0], [84.5, 1065.0], [84.6, 1065.0], [84.7, 1065.0], [84.8, 1065.0], [84.9, 1065.0], [85.0, 1157.0], [85.1, 1157.0], [85.2, 1157.0], [85.3, 1157.0], [85.4, 1157.0], [85.5, 1157.0], [85.6, 1157.0], [85.7, 1157.0], [85.8, 1157.0], [85.9, 1157.0], [86.0, 1157.0], [86.1, 1157.0], [86.2, 1157.0], [86.3, 1157.0], [86.4, 1157.0], [86.5, 1157.0], [86.6, 1157.0], [86.7, 1157.0], [86.8, 1157.0], [86.9, 1157.0], [87.0, 1157.0], [87.1, 1157.0], [87.2, 1157.0], [87.3, 1157.0], [87.4, 1157.0], [87.5, 1157.0], [87.6, 1157.0], [87.7, 1157.0], [87.8, 1157.0], [87.9, 1157.0], [88.0, 1158.0], [88.1, 1158.0], [88.2, 1158.0], [88.3, 1158.0], [88.4, 1158.0], [88.5, 1158.0], [88.6, 1158.0], [88.7, 1158.0], [88.8, 1158.0], [88.9, 1158.0], [89.0, 1158.0], [89.1, 1158.0], [89.2, 1158.0], [89.3, 1158.0], [89.4, 1158.0], [89.5, 1158.0], [89.6, 1158.0], [89.7, 1158.0], [89.8, 1158.0], [89.9, 1158.0], [90.0, 1163.0], [90.1, 1163.0], [90.2, 1163.0], [90.3, 1163.0], [90.4, 1163.0], [90.5, 1163.0], [90.6, 1163.0], [90.7, 1163.0], [90.8, 1163.0], [90.9, 1163.0], [91.0, 1167.0], [91.1, 1167.0], [91.2, 1167.0], [91.3, 1167.0], [91.4, 1167.0], [91.5, 1167.0], [91.6, 1167.0], [91.7, 1167.0], [91.8, 1167.0], [91.9, 1167.0], [92.0, 1167.0], [92.1, 1167.0], [92.2, 1167.0], [92.3, 1167.0], [92.4, 1167.0], [92.5, 1167.0], [92.6, 1167.0], [92.7, 1167.0], [92.8, 1167.0], [92.9, 1167.0], [93.0, 1167.0], [93.1, 1167.0], [93.2, 1167.0], [93.3, 1167.0], [93.4, 1167.0], [93.5, 1167.0], [93.6, 1167.0], [93.7, 1167.0], [93.8, 1167.0], [93.9, 1167.0], [94.0, 1168.0], [94.1, 1168.0], [94.2, 1168.0], [94.3, 1168.0], [94.4, 1168.0], [94.5, 1168.0], [94.6, 1168.0], [94.7, 1168.0], [94.8, 1168.0], [94.9, 1168.0], [95.0, 1168.0], [95.1, 1168.0], [95.2, 1168.0], [95.3, 1168.0], [95.4, 1168.0], [95.5, 1168.0], [95.6, 1168.0], [95.7, 1168.0], [95.8, 1168.0], [95.9, 1168.0], [96.0, 1168.0], [96.1, 1168.0], [96.2, 1168.0], [96.3, 1168.0], [96.4, 1168.0], [96.5, 1168.0], [96.6, 1168.0], [96.7, 1168.0], [96.8, 1168.0], [96.9, 1168.0], [97.0, 1201.0], [97.1, 1201.0], [97.2, 1201.0], [97.3, 1201.0], [97.4, 1201.0], [97.5, 1201.0], [97.6, 1201.0], [97.7, 1201.0], [97.8, 1201.0], [97.9, 1201.0], [98.0, 1204.0], [98.1, 1204.0], [98.2, 1204.0], [98.3, 1204.0], [98.4, 1204.0], [98.5, 1204.0], [98.6, 1204.0], [98.7, 1204.0], [98.8, 1204.0], [98.9, 1204.0], [99.0, 1568.0], [99.1, 1568.0], [99.2, 1568.0], [99.3, 1568.0], [99.4, 1568.0], [99.5, 1568.0], [99.6, 1568.0], [99.7, 1568.0], [99.8, 1568.0], [99.9, 1568.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 200.0, "maxY": 19.0, "series": [{"data": [[1100.0, 12.0], [300.0, 9.0], [600.0, 11.0], [1200.0, 2.0], [700.0, 3.0], [1500.0, 1.0], [200.0, 6.0], [400.0, 12.0], [800.0, 17.0], [900.0, 19.0], [500.0, 6.0], [1000.0, 2.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 1500.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 1.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 72.0, "series": [{"data": [[0.0, 27.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 72.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 1.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 4.580000000000001, "minX": 1.75107894E12, "maxY": 4.580000000000001, "series": [{"data": [[1.75107894E12, 4.580000000000001]], "isOverall": false, "label": "Auth Test Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107894E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 238.2, "minX": 1.0, "maxY": 1094.8235294117644, "series": [{"data": [[1.0, 238.2], [2.0, 352.5], [4.0, 684.1428571428571], [5.0, 822.1111111111112], [3.0, 512.0], [6.0, 1003.7], [7.0, 1094.8235294117644]], "isOverall": false, "label": "Login Request", "isController": false}, {"data": [[4.580000000000001, 759.7]], "isOverall": false, "label": "Login Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 7.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 378.3333333333333, "minX": 1.75107894E12, "maxY": 896.6666666666666, "series": [{"data": [[1.75107894E12, 896.6666666666666]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.75107894E12, 378.3333333333333]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107894E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 759.7, "minX": 1.75107894E12, "maxY": 759.7, "series": [{"data": [[1.75107894E12, 759.7]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107894E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 759.6799999999997, "minX": 1.75107894E12, "maxY": 759.6799999999997, "series": [{"data": [[1.75107894E12, 759.6799999999997]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107894E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.15999999999999995, "minX": 1.75107894E12, "maxY": 0.15999999999999995, "series": [{"data": [[1.75107894E12, 0.15999999999999995]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107894E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 210.0, "minX": 1.75107894E12, "maxY": 1568.0, "series": [{"data": [[1.75107894E12, 1568.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.75107894E12, 210.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.75107894E12, 1162.5]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.75107894E12, 1564.359999999998]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.75107894E12, 826.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.75107894E12, 1168.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107894E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 213.0, "minX": 2.0, "maxY": 830.5, "series": [{"data": [[2.0, 331.5], [5.0, 244.0], [3.0, 213.0], [6.0, 830.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 213.0, "minX": 2.0, "maxY": 830.5, "series": [{"data": [[2.0, 331.5], [5.0, 244.0], [3.0, 213.0], [6.0, 830.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 1.6666666666666667, "minX": 1.75107894E12, "maxY": 1.6666666666666667, "series": [{"data": [[1.75107894E12, 1.6666666666666667]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107894E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 1.6666666666666667, "minX": 1.75107894E12, "maxY": 1.6666666666666667, "series": [{"data": [[1.75107894E12, 1.6666666666666667]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107894E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 1.6666666666666667, "minX": 1.75107894E12, "maxY": 1.6666666666666667, "series": [{"data": [[1.75107894E12, 1.6666666666666667]], "isOverall": false, "label": "Login Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107894E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 1.6666666666666667, "minX": 1.75107894E12, "maxY": 1.6666666666666667, "series": [{"data": [[1.75107894E12, 1.6666666666666667]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107894E12, "title": "Total Transactions Per Second"}},
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

