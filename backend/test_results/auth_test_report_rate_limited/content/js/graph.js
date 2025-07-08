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
        data: {"result": {"minY": 211.0, "minX": 0.0, "maxY": 11411.0, "series": [{"data": [[0.0, 211.0], [0.1, 211.0], [0.2, 213.0], [0.3, 213.0], [0.4, 216.0], [0.5, 216.0], [0.6, 216.0], [0.7, 323.0], [0.8, 330.0], [0.9, 330.0], [1.0, 347.0], [1.1, 347.0], [1.2, 374.0], [1.3, 374.0], [1.4, 507.0], [1.5, 507.0], [1.6, 511.0], [1.7, 511.0], [1.8, 517.0], [1.9, 517.0], [2.0, 518.0], [2.1, 518.0], [2.2, 674.0], [2.3, 674.0], [2.4, 682.0], [2.5, 682.0], [2.6, 715.0], [2.7, 715.0], [2.8, 715.0], [2.9, 724.0], [3.0, 724.0], [3.1, 830.0], [3.2, 830.0], [3.3, 833.0], [3.4, 833.0], [3.5, 849.0], [3.6, 849.0], [3.7, 852.0], [3.8, 852.0], [3.9, 863.0], [4.0, 863.0], [4.1, 993.0], [4.2, 993.0], [4.3, 995.0], [4.4, 995.0], [4.5, 995.0], [4.6, 995.0], [4.7, 996.0], [4.8, 996.0], [4.9, 1036.0], [5.0, 1036.0], [5.1, 1201.0], [5.2, 1201.0], [5.3, 1329.0], [5.4, 1329.0], [5.5, 1330.0], [5.6, 1330.0], [5.7, 1330.0], [5.8, 1330.0], [5.9, 1332.0], [6.0, 1332.0], [6.1, 1335.0], [6.2, 1335.0], [6.3, 1361.0], [6.4, 1361.0], [6.5, 1370.0], [6.6, 1370.0], [6.7, 1373.0], [6.8, 1373.0], [6.9, 1552.0], [7.0, 1552.0], [7.1, 1578.0], [7.2, 1578.0], [7.3, 1693.0], [7.4, 1693.0], [7.5, 1712.0], [7.6, 1712.0], [7.7, 1715.0], [7.8, 1715.0], [7.9, 1718.0], [8.0, 1718.0], [8.1, 1719.0], [8.2, 1719.0], [8.3, 1720.0], [8.4, 1720.0], [8.5, 1722.0], [8.6, 1722.0], [8.7, 1722.0], [8.8, 1722.0], [8.9, 1760.0], [9.0, 1760.0], [9.1, 1865.0], [9.2, 1865.0], [9.3, 1990.0], [9.4, 1990.0], [9.5, 1990.0], [9.6, 1990.0], [9.7, 1990.0], [9.8, 1992.0], [9.9, 1992.0], [10.0, 1994.0], [10.1, 1994.0], [10.2, 1997.0], [10.3, 1997.0], [10.4, 2049.0], [10.5, 2049.0], [10.6, 2085.0], [10.7, 2085.0], [10.8, 2088.0], [10.9, 2088.0], [11.0, 2196.0], [11.1, 2196.0], [11.2, 2215.0], [11.3, 2215.0], [11.4, 2218.0], [11.5, 2218.0], [11.6, 2392.0], [11.7, 2392.0], [11.8, 2401.0], [11.9, 2401.0], [12.0, 2412.0], [12.1, 2412.0], [12.2, 2498.0], [12.3, 2498.0], [12.4, 2498.0], [12.5, 2498.0], [12.6, 2498.0], [12.7, 2498.0], [12.8, 2498.0], [12.9, 2498.0], [13.0, 2498.0], [13.1, 2498.0], [13.2, 2502.0], [13.3, 2502.0], [13.4, 2532.0], [13.5, 2532.0], [13.6, 2532.0], [13.7, 2532.0], [13.8, 2538.0], [13.9, 2538.0], [14.0, 2672.0], [14.1, 2672.0], [14.2, 2674.0], [14.3, 2674.0], [14.4, 2676.0], [14.5, 2676.0], [14.6, 2716.0], [14.7, 2716.0], [14.8, 2716.0], [14.9, 2716.0], [15.0, 2737.0], [15.1, 2737.0], [15.2, 2748.0], [15.3, 2748.0], [15.4, 3046.0], [15.5, 3046.0], [15.6, 3071.0], [15.7, 3071.0], [15.8, 3079.0], [15.9, 3079.0], [16.0, 3080.0], [16.1, 3080.0], [16.2, 3164.0], [16.3, 3164.0], [16.4, 3167.0], [16.5, 3167.0], [16.6, 3167.0], [16.7, 3167.0], [16.8, 3167.0], [16.9, 3167.0], [17.0, 3168.0], [17.1, 3168.0], [17.2, 3168.0], [17.3, 3168.0], [17.4, 3169.0], [17.5, 3169.0], [17.6, 3172.0], [17.7, 3172.0], [17.8, 3174.0], [17.9, 3174.0], [18.0, 3415.0], [18.1, 3415.0], [18.2, 3416.0], [18.3, 3416.0], [18.4, 3577.0], [18.5, 3577.0], [18.6, 3581.0], [18.7, 3581.0], [18.8, 3583.0], [18.9, 3583.0], [19.0, 3585.0], [19.1, 3585.0], [19.2, 3585.0], [19.3, 3585.0], [19.4, 3586.0], [19.5, 3586.0], [19.6, 3587.0], [19.7, 3587.0], [19.8, 3590.0], [19.9, 3590.0], [20.0, 3591.0], [20.1, 3591.0], [20.2, 3592.0], [20.3, 3592.0], [20.4, 3602.0], [20.5, 3602.0], [20.6, 3664.0], [20.7, 3664.0], [20.8, 3665.0], [20.9, 3665.0], [21.0, 3665.0], [21.1, 3665.0], [21.2, 3669.0], [21.3, 3669.0], [21.4, 3670.0], [21.5, 3670.0], [21.6, 3705.0], [21.7, 3705.0], [21.8, 3708.0], [21.9, 3708.0], [22.0, 3710.0], [22.1, 3710.0], [22.2, 3745.0], [22.3, 3745.0], [22.4, 3773.0], [22.5, 3773.0], [22.6, 3774.0], [22.7, 3774.0], [22.8, 3778.0], [22.9, 3778.0], [23.0, 3939.0], [23.1, 3939.0], [23.2, 3942.0], [23.3, 3942.0], [23.4, 3943.0], [23.5, 3943.0], [23.6, 3943.0], [23.7, 3943.0], [23.8, 3944.0], [23.9, 3944.0], [24.0, 3944.0], [24.1, 3944.0], [24.2, 3945.0], [24.3, 3945.0], [24.4, 3946.0], [24.5, 3946.0], [24.6, 3946.0], [24.7, 3946.0], [24.8, 3946.0], [24.9, 3946.0], [25.0, 3947.0], [25.1, 3947.0], [25.2, 3948.0], [25.3, 3948.0], [25.4, 3949.0], [25.5, 3949.0], [25.6, 3951.0], [25.7, 3951.0], [25.8, 4078.0], [25.9, 4078.0], [26.0, 4081.0], [26.1, 4081.0], [26.2, 4085.0], [26.3, 4085.0], [26.4, 4166.0], [26.5, 4166.0], [26.6, 4168.0], [26.7, 4168.0], [26.8, 4169.0], [26.9, 4169.0], [27.0, 4170.0], [27.1, 4170.0], [27.2, 4171.0], [27.3, 4171.0], [27.4, 4171.0], [27.5, 4171.0], [27.6, 4172.0], [27.7, 4172.0], [27.8, 4172.0], [27.9, 4172.0], [28.0, 4206.0], [28.1, 4206.0], [28.2, 4413.0], [28.3, 4413.0], [28.4, 4418.0], [28.5, 4418.0], [28.6, 4448.0], [28.7, 4448.0], [28.8, 4496.0], [28.9, 4496.0], [29.0, 4497.0], [29.1, 4497.0], [29.2, 4497.0], [29.3, 4497.0], [29.4, 4499.0], [29.5, 4499.0], [29.6, 4499.0], [29.7, 4499.0], [29.8, 4500.0], [29.9, 4500.0], [30.0, 4500.0], [30.1, 4500.0], [30.2, 4501.0], [30.3, 4501.0], [30.4, 4508.0], [30.5, 4508.0], [30.6, 4536.0], [30.7, 4536.0], [30.8, 4537.0], [30.9, 4537.0], [31.0, 4537.0], [31.1, 4537.0], [31.2, 4539.0], [31.3, 4539.0], [31.4, 4540.0], [31.5, 4540.0], [31.6, 4542.0], [31.7, 4542.0], [31.8, 4543.0], [31.9, 4543.0], [32.0, 4622.0], [32.1, 4622.0], [32.2, 4667.0], [32.3, 4667.0], [32.4, 4668.0], [32.5, 4668.0], [32.6, 4669.0], [32.7, 4669.0], [32.8, 4671.0], [32.9, 4671.0], [33.0, 4676.0], [33.1, 4676.0], [33.2, 4757.0], [33.3, 4757.0], [33.4, 4912.0], [33.5, 4912.0], [33.6, 5083.0], [33.7, 5083.0], [33.8, 5088.0], [33.9, 5088.0], [34.0, 5089.0], [34.1, 5089.0], [34.2, 5092.0], [34.3, 5092.0], [34.4, 5094.0], [34.5, 5094.0], [34.6, 5095.0], [34.7, 5095.0], [34.8, 5096.0], [34.9, 5096.0], [35.0, 5097.0], [35.1, 5097.0], [35.2, 5098.0], [35.3, 5098.0], [35.4, 5098.0], [35.5, 5098.0], [35.6, 5100.0], [35.7, 5100.0], [35.8, 5103.0], [35.9, 5103.0], [36.0, 5107.0], [36.1, 5107.0], [36.2, 5119.0], [36.3, 5119.0], [36.4, 5248.0], [36.5, 5248.0], [36.6, 5249.0], [36.7, 5249.0], [36.8, 5267.0], [36.9, 5267.0], [37.0, 5269.0], [37.1, 5269.0], [37.2, 5271.0], [37.3, 5271.0], [37.4, 5271.0], [37.5, 5271.0], [37.6, 5272.0], [37.7, 5272.0], [37.8, 5272.0], [37.9, 5273.0], [38.0, 5273.0], [38.1, 5273.0], [38.2, 5274.0], [38.3, 5274.0], [38.4, 5274.0], [38.5, 5274.0], [38.6, 5277.0], [38.7, 5277.0], [38.8, 5277.0], [38.9, 5500.0], [39.0, 5500.0], [39.1, 5500.0], [39.2, 5501.0], [39.3, 5501.0], [39.4, 5501.0], [39.5, 5501.0], [39.6, 5541.0], [39.7, 5541.0], [39.8, 5541.0], [39.9, 5592.0], [40.0, 5592.0], [40.1, 5594.0], [40.2, 5594.0], [40.3, 5601.0], [40.4, 5601.0], [40.5, 5664.0], [40.6, 5664.0], [40.7, 5746.0], [40.8, 5746.0], [40.9, 5746.0], [41.0, 5746.0], [41.1, 5747.0], [41.2, 5747.0], [41.3, 5748.0], [41.4, 5748.0], [41.5, 5748.0], [41.6, 5748.0], [41.7, 5749.0], [41.8, 5749.0], [41.9, 5751.0], [42.0, 5751.0], [42.1, 5753.0], [42.2, 5753.0], [42.3, 5757.0], [42.4, 5757.0], [42.5, 5759.0], [42.6, 5759.0], [42.7, 5761.0], [42.8, 5761.0], [42.9, 5761.0], [43.0, 5761.0], [43.1, 5766.0], [43.2, 5766.0], [43.3, 5768.0], [43.4, 5768.0], [43.5, 5768.0], [43.6, 5768.0], [43.7, 5768.0], [43.8, 5768.0], [43.9, 5773.0], [44.0, 5773.0], [44.1, 5774.0], [44.2, 5774.0], [44.3, 5774.0], [44.4, 5774.0], [44.5, 5776.0], [44.6, 5776.0], [44.7, 5781.0], [44.8, 5781.0], [44.9, 5783.0], [45.0, 5783.0], [45.1, 5783.0], [45.2, 5783.0], [45.3, 5787.0], [45.4, 5787.0], [45.5, 5788.0], [45.6, 5788.0], [45.7, 5789.0], [45.8, 5789.0], [45.9, 5791.0], [46.0, 5791.0], [46.1, 5792.0], [46.2, 5792.0], [46.3, 5792.0], [46.4, 5792.0], [46.5, 5794.0], [46.6, 5794.0], [46.7, 5828.0], [46.8, 5828.0], [46.9, 5831.0], [47.0, 5831.0], [47.1, 5831.0], [47.2, 5831.0], [47.3, 5831.0], [47.4, 5831.0], [47.5, 5831.0], [47.6, 5831.0], [47.7, 5832.0], [47.8, 5832.0], [47.9, 5832.0], [48.0, 5832.0], [48.1, 5832.0], [48.2, 5832.0], [48.3, 5832.0], [48.4, 5832.0], [48.5, 5832.0], [48.6, 5832.0], [48.7, 5833.0], [48.8, 5833.0], [48.9, 5834.0], [49.0, 5834.0], [49.1, 5835.0], [49.2, 5835.0], [49.3, 5876.0], [49.4, 5876.0], [49.5, 5916.0], [49.6, 5916.0], [49.7, 5918.0], [49.8, 5918.0], [49.9, 6036.0], [50.0, 6036.0], [50.1, 6092.0], [50.2, 6092.0], [50.3, 6233.0], [50.4, 6233.0], [50.5, 6233.0], [50.6, 6233.0], [50.7, 6237.0], [50.8, 6237.0], [50.9, 6239.0], [51.0, 6239.0], [51.1, 6241.0], [51.2, 6241.0], [51.3, 6242.0], [51.4, 6242.0], [51.5, 6244.0], [51.6, 6244.0], [51.7, 6245.0], [51.8, 6245.0], [51.9, 6247.0], [52.0, 6247.0], [52.1, 6248.0], [52.2, 6248.0], [52.3, 6254.0], [52.4, 6254.0], [52.5, 6259.0], [52.6, 6259.0], [52.7, 6265.0], [52.8, 6265.0], [52.9, 6267.0], [53.0, 6267.0], [53.1, 6268.0], [53.2, 6268.0], [53.3, 6270.0], [53.4, 6270.0], [53.5, 6274.0], [53.6, 6274.0], [53.7, 6274.0], [53.8, 6274.0], [53.9, 6275.0], [54.0, 6275.0], [54.1, 6278.0], [54.2, 6278.0], [54.3, 6326.0], [54.4, 6326.0], [54.5, 6327.0], [54.6, 6327.0], [54.7, 6328.0], [54.8, 6328.0], [54.9, 6328.0], [55.0, 6328.0], [55.1, 6328.0], [55.2, 6328.0], [55.3, 6366.0], [55.4, 6366.0], [55.5, 6367.0], [55.6, 6367.0], [55.7, 6418.0], [55.8, 6418.0], [55.9, 6588.0], [56.0, 6588.0], [56.1, 6657.0], [56.2, 6657.0], [56.3, 6659.0], [56.4, 6659.0], [56.5, 6659.0], [56.6, 6659.0], [56.7, 6659.0], [56.8, 6659.0], [56.9, 6660.0], [57.0, 6660.0], [57.1, 6698.0], [57.2, 6698.0], [57.3, 6699.0], [57.4, 6699.0], [57.5, 6700.0], [57.6, 6700.0], [57.7, 6700.0], [57.8, 6700.0], [57.9, 6737.0], [58.0, 6737.0], [58.1, 6738.0], [58.2, 6738.0], [58.3, 6738.0], [58.4, 6738.0], [58.5, 6739.0], [58.6, 6739.0], [58.7, 6739.0], [58.8, 6739.0], [58.9, 6739.0], [59.0, 6739.0], [59.1, 6740.0], [59.2, 6740.0], [59.3, 6740.0], [59.4, 6740.0], [59.5, 6743.0], [59.6, 6743.0], [59.7, 6745.0], [59.8, 6745.0], [59.9, 6749.0], [60.0, 6749.0], [60.1, 6749.0], [60.2, 6749.0], [60.3, 6749.0], [60.4, 6749.0], [60.5, 6749.0], [60.6, 6749.0], [60.7, 6749.0], [60.8, 6749.0], [60.9, 6750.0], [61.0, 6750.0], [61.1, 6750.0], [61.2, 6750.0], [61.3, 6752.0], [61.4, 6752.0], [61.5, 6753.0], [61.6, 6753.0], [61.7, 6753.0], [61.8, 6753.0], [61.9, 6754.0], [62.0, 6754.0], [62.1, 6754.0], [62.2, 6754.0], [62.3, 6755.0], [62.4, 6755.0], [62.5, 6755.0], [62.6, 6755.0], [62.7, 6756.0], [62.8, 6756.0], [62.9, 6756.0], [63.0, 6756.0], [63.1, 6756.0], [63.2, 6756.0], [63.3, 6756.0], [63.4, 6756.0], [63.5, 6757.0], [63.6, 6757.0], [63.7, 6758.0], [63.8, 6758.0], [63.9, 6759.0], [64.0, 6759.0], [64.1, 6828.0], [64.2, 6828.0], [64.3, 6868.0], [64.4, 6868.0], [64.5, 6917.0], [64.6, 6917.0], [64.7, 7029.0], [64.8, 7029.0], [64.9, 7030.0], [65.0, 7030.0], [65.1, 7030.0], [65.2, 7030.0], [65.3, 7030.0], [65.4, 7030.0], [65.5, 7032.0], [65.6, 7032.0], [65.7, 7032.0], [65.8, 7032.0], [65.9, 7032.0], [66.0, 7032.0], [66.1, 7032.0], [66.2, 7032.0], [66.3, 7032.0], [66.4, 7032.0], [66.5, 7032.0], [66.6, 7032.0], [66.7, 7033.0], [66.8, 7033.0], [66.9, 7033.0], [67.0, 7033.0], [67.1, 7033.0], [67.2, 7033.0], [67.3, 7033.0], [67.4, 7033.0], [67.5, 7038.0], [67.6, 7038.0], [67.7, 7039.0], [67.8, 7039.0], [67.9, 7043.0], [68.0, 7043.0], [68.1, 7044.0], [68.2, 7044.0], [68.3, 7045.0], [68.4, 7045.0], [68.5, 7045.0], [68.6, 7045.0], [68.7, 7045.0], [68.8, 7045.0], [68.9, 7047.0], [69.0, 7047.0], [69.1, 7047.0], [69.2, 7047.0], [69.3, 7049.0], [69.4, 7049.0], [69.5, 7051.0], [69.6, 7051.0], [69.7, 7052.0], [69.8, 7052.0], [69.9, 7053.0], [70.0, 7053.0], [70.1, 7053.0], [70.2, 7053.0], [70.3, 7053.0], [70.4, 7053.0], [70.5, 7054.0], [70.6, 7054.0], [70.7, 7054.0], [70.8, 7054.0], [70.9, 7054.0], [71.0, 7054.0], [71.1, 7057.0], [71.2, 7057.0], [71.3, 7057.0], [71.4, 7057.0], [71.5, 7058.0], [71.6, 7058.0], [71.7, 7064.0], [71.8, 7064.0], [71.9, 7068.0], [72.0, 7068.0], [72.1, 7068.0], [72.2, 7068.0], [72.3, 7068.0], [72.4, 7068.0], [72.5, 7070.0], [72.6, 7070.0], [72.7, 7083.0], [72.8, 7083.0], [72.9, 7158.0], [73.0, 7158.0], [73.1, 7159.0], [73.2, 7159.0], [73.3, 7159.0], [73.4, 7159.0], [73.5, 7159.0], [73.6, 7159.0], [73.7, 7159.0], [73.8, 7159.0], [73.9, 7160.0], [74.0, 7160.0], [74.1, 7160.0], [74.2, 7160.0], [74.3, 7161.0], [74.4, 7161.0], [74.5, 7161.0], [74.6, 7161.0], [74.7, 7162.0], [74.8, 7162.0], [74.9, 7162.0], [75.0, 7162.0], [75.1, 7162.0], [75.2, 7162.0], [75.3, 7162.0], [75.4, 7162.0], [75.5, 7164.0], [75.6, 7164.0], [75.7, 7192.0], [75.8, 7192.0], [75.9, 7194.0], [76.0, 7194.0], [76.1, 7194.0], [76.2, 7194.0], [76.3, 7194.0], [76.4, 7194.0], [76.5, 7196.0], [76.6, 7196.0], [76.7, 7196.0], [76.8, 7196.0], [76.9, 7199.0], [77.0, 7199.0], [77.1, 7199.0], [77.2, 7199.0], [77.3, 7199.0], [77.4, 7199.0], [77.5, 7201.0], [77.6, 7201.0], [77.7, 7203.0], [77.8, 7203.0], [77.9, 7204.0], [78.0, 7204.0], [78.1, 7247.0], [78.2, 7247.0], [78.3, 7347.0], [78.4, 7347.0], [78.5, 7349.0], [78.6, 7349.0], [78.7, 7351.0], [78.8, 7351.0], [78.9, 7352.0], [79.0, 7352.0], [79.1, 7353.0], [79.2, 7353.0], [79.3, 7353.0], [79.4, 7353.0], [79.5, 7355.0], [79.6, 7355.0], [79.7, 7355.0], [79.8, 7355.0], [79.9, 7356.0], [80.0, 7356.0], [80.1, 7356.0], [80.2, 7356.0], [80.3, 7357.0], [80.4, 7357.0], [80.5, 7357.0], [80.6, 7357.0], [80.7, 7361.0], [80.8, 7361.0], [80.9, 7419.0], [81.0, 7419.0], [81.1, 7440.0], [81.2, 7440.0], [81.3, 7441.0], [81.4, 7441.0], [81.5, 7442.0], [81.6, 7442.0], [81.7, 7442.0], [81.8, 7442.0], [81.9, 7443.0], [82.0, 7443.0], [82.1, 7443.0], [82.2, 7443.0], [82.3, 7444.0], [82.4, 7444.0], [82.5, 7446.0], [82.6, 7446.0], [82.7, 7446.0], [82.8, 7446.0], [82.9, 7446.0], [83.0, 7446.0], [83.1, 7447.0], [83.2, 7447.0], [83.3, 7449.0], [83.4, 7449.0], [83.5, 7449.0], [83.6, 7449.0], [83.7, 7449.0], [83.8, 7449.0], [83.9, 7450.0], [84.0, 7450.0], [84.1, 7451.0], [84.2, 7451.0], [84.3, 7451.0], [84.4, 7451.0], [84.5, 7452.0], [84.6, 7452.0], [84.7, 7454.0], [84.8, 7454.0], [84.9, 7454.0], [85.0, 7454.0], [85.1, 7510.0], [85.2, 7510.0], [85.3, 7510.0], [85.4, 7510.0], [85.5, 7511.0], [85.6, 7511.0], [85.7, 7512.0], [85.8, 7512.0], [85.9, 7512.0], [86.0, 7512.0], [86.1, 7512.0], [86.2, 7512.0], [86.3, 7512.0], [86.4, 7512.0], [86.5, 7513.0], [86.6, 7513.0], [86.7, 7513.0], [86.8, 7513.0], [86.9, 7513.0], [87.0, 7513.0], [87.1, 7515.0], [87.2, 7515.0], [87.3, 7516.0], [87.4, 7516.0], [87.5, 7517.0], [87.6, 7517.0], [87.7, 7600.0], [87.8, 7600.0], [87.9, 7601.0], [88.0, 7601.0], [88.1, 7603.0], [88.2, 7603.0], [88.3, 7604.0], [88.4, 7604.0], [88.5, 7605.0], [88.6, 7605.0], [88.7, 7605.0], [88.8, 7605.0], [88.9, 7606.0], [89.0, 7606.0], [89.1, 7606.0], [89.2, 7606.0], [89.3, 7606.0], [89.4, 7606.0], [89.5, 7606.0], [89.6, 7606.0], [89.7, 7606.0], [89.8, 7606.0], [89.9, 7606.0], [90.0, 7606.0], [90.1, 7607.0], [90.2, 7607.0], [90.3, 7607.0], [90.4, 7607.0], [90.5, 7610.0], [90.6, 7610.0], [90.7, 7610.0], [90.8, 7610.0], [90.9, 7620.0], [91.0, 7620.0], [91.1, 7621.0], [91.2, 7621.0], [91.3, 7621.0], [91.4, 7621.0], [91.5, 7623.0], [91.6, 7623.0], [91.7, 7623.0], [91.8, 7623.0], [91.9, 7662.0], [92.0, 7662.0], [92.1, 7663.0], [92.2, 7663.0], [92.3, 7663.0], [92.4, 7663.0], [92.5, 7664.0], [92.6, 7664.0], [92.7, 7675.0], [92.8, 7675.0], [92.9, 7677.0], [93.0, 7677.0], [93.1, 7677.0], [93.2, 7677.0], [93.3, 7680.0], [93.4, 7680.0], [93.5, 7681.0], [93.6, 7681.0], [93.7, 7682.0], [93.8, 7682.0], [93.9, 7682.0], [94.0, 7682.0], [94.1, 7682.0], [94.2, 7682.0], [94.3, 7682.0], [94.4, 7682.0], [94.5, 7683.0], [94.6, 7683.0], [94.7, 7683.0], [94.8, 7683.0], [94.9, 7683.0], [95.0, 7683.0], [95.1, 7684.0], [95.2, 7684.0], [95.3, 7684.0], [95.4, 7684.0], [95.5, 7684.0], [95.6, 7684.0], [95.7, 7685.0], [95.8, 7685.0], [95.9, 7685.0], [96.0, 7685.0], [96.1, 7685.0], [96.2, 7685.0], [96.3, 7699.0], [96.4, 7699.0], [96.5, 7711.0], [96.6, 7711.0], [96.7, 7720.0], [96.8, 7720.0], [96.9, 7721.0], [97.0, 7721.0], [97.1, 7725.0], [97.2, 7725.0], [97.3, 7725.0], [97.4, 7725.0], [97.5, 7726.0], [97.6, 7726.0], [97.7, 7752.0], [97.8, 7752.0], [97.9, 8077.0], [98.0, 8077.0], [98.1, 8413.0], [98.2, 8413.0], [98.3, 8581.0], [98.4, 8581.0], [98.5, 8912.0], [98.6, 8912.0], [98.7, 8915.0], [98.8, 8915.0], [98.9, 9085.0], [99.0, 9085.0], [99.1, 9244.0], [99.2, 9244.0], [99.3, 9246.0], [99.4, 9246.0], [99.5, 10741.0], [99.6, 10741.0], [99.7, 11074.0], [99.8, 11074.0], [99.9, 11411.0], [100.0, 11411.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 200.0, "maxY": 44.0, "series": [{"data": [[600.0, 2.0], [700.0, 2.0], [800.0, 5.0], [900.0, 4.0], [1000.0, 1.0], [1200.0, 1.0], [1300.0, 8.0], [1500.0, 2.0], [1600.0, 1.0], [1700.0, 8.0], [1800.0, 1.0], [1900.0, 6.0], [2000.0, 3.0], [2100.0, 1.0], [2300.0, 1.0], [2200.0, 2.0], [2400.0, 7.0], [2500.0, 4.0], [2600.0, 3.0], [2700.0, 4.0], [3000.0, 4.0], [3100.0, 9.0], [3400.0, 2.0], [3500.0, 10.0], [3700.0, 7.0], [3600.0, 6.0], [3900.0, 14.0], [4000.0, 3.0], [4200.0, 1.0], [4100.0, 8.0], [4400.0, 8.0], [4500.0, 11.0], [4600.0, 6.0], [4700.0, 1.0], [4900.0, 1.0], [5000.0, 10.0], [5100.0, 4.0], [5200.0, 12.0], [5500.0, 7.0], [5600.0, 2.0], [5800.0, 14.0], [5700.0, 30.0], [6000.0, 2.0], [5900.0, 2.0], [6300.0, 7.0], [6200.0, 20.0], [6400.0, 1.0], [6500.0, 1.0], [6600.0, 7.0], [6700.0, 33.0], [6900.0, 1.0], [6800.0, 2.0], [7000.0, 41.0], [7100.0, 23.0], [7200.0, 4.0], [7400.0, 21.0], [7300.0, 13.0], [7600.0, 44.0], [7500.0, 13.0], [7700.0, 7.0], [8000.0, 1.0], [8500.0, 1.0], [8400.0, 1.0], [9000.0, 1.0], [8900.0, 2.0], [9200.0, 2.0], [10700.0, 1.0], [11000.0, 1.0], [11400.0, 1.0], [200.0, 3.0], [300.0, 4.0], [500.0, 4.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 11400.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 7.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 466.0, "series": [{"data": [[0.0, 7.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 27.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 466.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 31.032407407407415, "minX": 1.75107924E12, "maxY": 33.96830985915494, "series": [{"data": [[1.7510793E12, 31.032407407407415], [1.75107924E12, 33.96830985915494]], "isOverall": false, "label": "Auth Test Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7510793E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 690.75, "minX": 1.0, "maxY": 7608.536585365854, "series": [{"data": [[2.0, 750.3333333333333], [32.0, 4811.5], [33.0, 5284.714285714286], [34.0, 6229.406249999999], [35.0, 5464.333333333333], [36.0, 5568.2], [37.0, 6477.76], [38.0, 4791.444444444444], [39.0, 5159.0], [40.0, 6903.529411764705], [41.0, 5301.75], [42.0, 7316.886363636364], [43.0, 7408.692307692308], [44.0, 7426.675675675678], [45.0, 7608.536585365854], [46.0, 6679.586956521739], [3.0, 690.75], [4.0, 937.5], [5.0, 1031.25], [6.0, 1165.25], [7.0, 1403.5], [8.0, 1536.5], [9.0, 1599.75], [10.0, 2603.0], [11.0, 1789.2], [12.0, 1948.6666666666667], [13.0, 2664.333333333333], [14.0, 2508.0], [15.0, 2629.0], [1.0, 715.0], [16.0, 2542.75], [17.0, 2481.25], [18.0, 2967.333333333333], [19.0, 3040.0], [20.0, 3240.5], [21.0, 3875.5], [22.0, 3983.1428571428573], [23.0, 4509.047619047618], [24.0, 4037.25], [25.0, 3798.5], [26.0, 4074.2], [27.0, 4137.8], [28.0, 4525.0], [29.0, 4306.5], [30.0, 5424.999999999999], [31.0, 5314.214285714285]], "isOverall": false, "label": "Login Request", "isController": false}, {"data": [[32.699999999999996, 5488.409999999996]], "isOverall": false, "label": "Login Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 46.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 817.2, "minX": 1.75107924E12, "maxY": 2546.5333333333333, "series": [{"data": [[1.7510793E12, 1936.8], [1.75107924E12, 2546.5333333333333]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7510793E12, 817.2], [1.75107924E12, 1074.4666666666667]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7510793E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 5132.834507042253, "minX": 1.75107924E12, "maxY": 5955.925925925929, "series": [{"data": [[1.7510793E12, 5955.925925925929], [1.75107924E12, 5132.834507042253]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7510793E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 5132.823943661973, "minX": 1.75107924E12, "maxY": 5955.916666666666, "series": [{"data": [[1.7510793E12, 5955.916666666666], [1.75107924E12, 5132.823943661973]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7510793E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.04166666666666667, "minX": 1.75107924E12, "maxY": 0.1760563380281691, "series": [{"data": [[1.7510793E12, 0.04166666666666667], [1.75107924E12, 0.1760563380281691]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7510793E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 211.0, "minX": 1.75107924E12, "maxY": 11411.0, "series": [{"data": [[1.7510793E12, 7454.0], [1.75107924E12, 11411.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7510793E12, 1712.0], [1.75107924E12, 211.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7510793E12, 7347.6], [1.75107924E12, 7682.5]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7510793E12, 7453.66], [1.75107924E12, 10790.949999999992]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7510793E12, 6266.0], [1.75107924E12, 5829.5]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.7510793E12, 7357.6], [1.75107924E12, 7725.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7510793E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 214.5, "minX": 3.0, "maxY": 6241.5, "series": [{"data": [[4.0, 214.5], [5.0, 5768.0], [6.0, 6241.5], [3.0, 1715.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 214.5, "minX": 3.0, "maxY": 6241.5, "series": [{"data": [[4.0, 214.5], [5.0, 5768.0], [6.0, 6241.5], [3.0, 1715.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 2.9, "minX": 1.75107924E12, "maxY": 5.433333333333334, "series": [{"data": [[1.7510793E12, 2.9], [1.75107924E12, 5.433333333333334]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7510793E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 3.6, "minX": 1.75107924E12, "maxY": 4.733333333333333, "series": [{"data": [[1.7510793E12, 3.6], [1.75107924E12, 4.733333333333333]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7510793E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 3.6, "minX": 1.75107924E12, "maxY": 4.733333333333333, "series": [{"data": [[1.7510793E12, 3.6], [1.75107924E12, 4.733333333333333]], "isOverall": false, "label": "Login Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7510793E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 3.6, "minX": 1.75107924E12, "maxY": 4.733333333333333, "series": [{"data": [[1.7510793E12, 3.6], [1.75107924E12, 4.733333333333333]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7510793E12, "title": "Total Transactions Per Second"}},
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

