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
        data: {"result": {"minY": 211.0, "minX": 0.0, "maxY": 8950.0, "series": [{"data": [[0.0, 211.0], [0.1, 211.0], [0.2, 211.0], [0.3, 213.0], [0.4, 213.0], [0.5, 225.0], [0.6, 225.0], [0.7, 225.0], [0.8, 321.0], [0.9, 321.0], [1.0, 332.0], [1.1, 332.0], [1.2, 332.0], [1.3, 347.0], [1.4, 347.0], [1.5, 375.0], [1.6, 375.0], [1.7, 375.0], [1.8, 497.0], [1.9, 497.0], [2.0, 501.0], [2.1, 501.0], [2.2, 501.0], [2.3, 501.0], [2.4, 501.0], [2.5, 504.0], [2.6, 504.0], [2.7, 504.0], [2.8, 516.0], [2.9, 516.0], [3.0, 544.0], [3.1, 544.0], [3.2, 544.0], [3.3, 662.0], [3.4, 662.0], [3.5, 665.0], [3.6, 665.0], [3.7, 665.0], [3.8, 666.0], [3.9, 666.0], [4.0, 711.0], [4.1, 711.0], [4.2, 711.0], [4.3, 994.0], [4.4, 994.0], [4.5, 995.0], [4.6, 995.0], [4.7, 995.0], [4.8, 996.0], [4.9, 996.0], [5.0, 996.0], [5.1, 996.0], [5.2, 996.0], [5.3, 998.0], [5.4, 998.0], [5.5, 999.0], [5.6, 999.0], [5.7, 999.0], [5.8, 1038.0], [5.9, 1038.0], [6.0, 1158.0], [6.1, 1158.0], [6.2, 1158.0], [6.3, 1159.0], [6.4, 1159.0], [6.5, 1161.0], [6.6, 1161.0], [6.7, 1161.0], [6.8, 1201.0], [6.9, 1201.0], [7.0, 1331.0], [7.1, 1331.0], [7.2, 1331.0], [7.3, 1378.0], [7.4, 1378.0], [7.5, 1488.0], [7.6, 1488.0], [7.7, 1488.0], [7.8, 1493.0], [7.9, 1493.0], [8.0, 1495.0], [8.1, 1495.0], [8.2, 1495.0], [8.3, 1495.0], [8.4, 1495.0], [8.5, 1498.0], [8.6, 1498.0], [8.7, 1498.0], [8.8, 1500.0], [8.9, 1500.0], [9.0, 1503.0], [9.1, 1503.0], [9.2, 1503.0], [9.3, 1514.0], [9.4, 1514.0], [9.5, 1515.0], [9.6, 1515.0], [9.7, 1515.0], [9.8, 1535.0], [9.9, 1535.0], [10.0, 1675.0], [10.1, 1675.0], [10.2, 1675.0], [10.3, 1681.0], [10.4, 1681.0], [10.5, 1682.0], [10.6, 1682.0], [10.7, 1682.0], [10.8, 1707.0], [10.9, 1707.0], [11.0, 1823.0], [11.1, 1823.0], [11.2, 1823.0], [11.3, 1823.0], [11.4, 1823.0], [11.5, 1823.0], [11.6, 1823.0], [11.7, 1823.0], [11.8, 1823.0], [11.9, 1823.0], [12.0, 1825.0], [12.1, 1825.0], [12.2, 1825.0], [12.3, 1827.0], [12.4, 1827.0], [12.5, 1828.0], [12.6, 1828.0], [12.7, 1828.0], [12.8, 1831.0], [12.9, 1831.0], [13.0, 1831.0], [13.1, 1831.0], [13.2, 1831.0], [13.3, 1863.0], [13.4, 1863.0], [13.5, 1867.0], [13.6, 1867.0], [13.7, 1867.0], [13.8, 1990.0], [13.9, 1990.0], [14.0, 2011.0], [14.1, 2011.0], [14.2, 2011.0], [14.3, 2014.0], [14.4, 2014.0], [14.5, 2157.0], [14.6, 2157.0], [14.7, 2157.0], [14.8, 2197.0], [14.9, 2197.0], [15.0, 2320.0], [15.1, 2320.0], [15.2, 2320.0], [15.3, 2322.0], [15.4, 2322.0], [15.5, 2322.0], [15.6, 2322.0], [15.7, 2322.0], [15.8, 2323.0], [15.9, 2323.0], [16.0, 2323.0], [16.1, 2323.0], [16.2, 2323.0], [16.3, 2323.0], [16.4, 2323.0], [16.5, 2323.0], [16.6, 2323.0], [16.7, 2323.0], [16.8, 2323.0], [16.9, 2323.0], [17.0, 2325.0], [17.1, 2325.0], [17.2, 2325.0], [17.3, 2326.0], [17.4, 2326.0], [17.5, 2364.0], [17.6, 2364.0], [17.7, 2364.0], [17.8, 2509.0], [17.9, 2509.0], [18.0, 2645.0], [18.1, 2645.0], [18.2, 2645.0], [18.3, 2651.0], [18.4, 2651.0], [18.5, 2670.0], [18.6, 2670.0], [18.7, 2670.0], [18.8, 2672.0], [18.9, 2672.0], [19.0, 2674.0], [19.1, 2674.0], [19.2, 2674.0], [19.3, 2675.0], [19.4, 2675.0], [19.5, 2821.0], [19.6, 2821.0], [19.7, 2821.0], [19.8, 2822.0], [19.9, 2822.0], [20.0, 2836.0], [20.1, 2836.0], [20.2, 2836.0], [20.3, 2836.0], [20.4, 2836.0], [20.5, 2840.0], [20.6, 2840.0], [20.7, 2840.0], [20.8, 2840.0], [20.9, 2840.0], [21.0, 2842.0], [21.1, 2842.0], [21.2, 2842.0], [21.3, 2864.0], [21.4, 2864.0], [21.5, 2969.0], [21.6, 2969.0], [21.7, 2969.0], [21.8, 2982.0], [21.9, 2982.0], [22.0, 2994.0], [22.1, 2994.0], [22.2, 2994.0], [22.3, 3004.0], [22.4, 3004.0], [22.5, 3005.0], [22.6, 3005.0], [22.7, 3005.0], [22.8, 3005.0], [22.9, 3005.0], [23.0, 3007.0], [23.1, 3007.0], [23.2, 3007.0], [23.3, 3139.0], [23.4, 3139.0], [23.5, 3153.0], [23.6, 3153.0], [23.7, 3153.0], [23.8, 3154.0], [23.9, 3154.0], [24.0, 3154.0], [24.1, 3154.0], [24.2, 3154.0], [24.3, 3154.0], [24.4, 3154.0], [24.5, 3155.0], [24.6, 3155.0], [24.7, 3155.0], [24.8, 3159.0], [24.9, 3159.0], [25.0, 3159.0], [25.1, 3159.0], [25.2, 3159.0], [25.3, 3197.0], [25.4, 3197.0], [25.5, 3305.0], [25.6, 3305.0], [25.7, 3305.0], [25.8, 3337.0], [25.9, 3337.0], [26.0, 3338.0], [26.1, 3338.0], [26.2, 3338.0], [26.3, 3339.0], [26.4, 3339.0], [26.5, 3340.0], [26.6, 3340.0], [26.7, 3340.0], [26.8, 3340.0], [26.9, 3340.0], [27.0, 3341.0], [27.1, 3341.0], [27.2, 3341.0], [27.3, 3342.0], [27.4, 3342.0], [27.5, 3343.0], [27.6, 3343.0], [27.7, 3343.0], [27.8, 3345.0], [27.9, 3345.0], [28.0, 3345.0], [28.1, 3345.0], [28.2, 3345.0], [28.3, 3345.0], [28.4, 3345.0], [28.5, 3469.0], [28.6, 3469.0], [28.7, 3469.0], [28.8, 3484.0], [28.9, 3484.0], [29.0, 3484.0], [29.1, 3484.0], [29.2, 3484.0], [29.3, 3487.0], [29.4, 3487.0], [29.5, 3488.0], [29.6, 3488.0], [29.7, 3488.0], [29.8, 3524.0], [29.9, 3524.0], [30.0, 3524.0], [30.1, 3524.0], [30.2, 3524.0], [30.3, 3524.0], [30.4, 3524.0], [30.5, 3525.0], [30.6, 3525.0], [30.7, 3525.0], [30.8, 3525.0], [30.9, 3525.0], [31.0, 3642.0], [31.1, 3642.0], [31.2, 3642.0], [31.3, 3678.0], [31.4, 3678.0], [31.5, 3678.0], [31.6, 3678.0], [31.7, 3678.0], [31.8, 3820.0], [31.9, 3820.0], [32.0, 3820.0], [32.1, 3820.0], [32.2, 3820.0], [32.3, 3821.0], [32.4, 3821.0], [32.5, 3821.0], [32.6, 3821.0], [32.7, 3821.0], [32.8, 3822.0], [32.9, 3822.0], [33.0, 3973.0], [33.1, 3973.0], [33.2, 3973.0], [33.3, 3986.0], [33.4, 3986.0], [33.5, 3987.0], [33.6, 3987.0], [33.7, 3987.0], [33.8, 3988.0], [33.9, 3988.0], [34.0, 3991.0], [34.1, 3991.0], [34.2, 3991.0], [34.3, 4027.0], [34.4, 4027.0], [34.5, 4028.0], [34.6, 4028.0], [34.7, 4028.0], [34.8, 4127.0], [34.9, 4127.0], [35.0, 4171.0], [35.1, 4171.0], [35.2, 4171.0], [35.3, 4172.0], [35.4, 4172.0], [35.5, 4173.0], [35.6, 4173.0], [35.7, 4173.0], [35.8, 4173.0], [35.9, 4173.0], [36.0, 4173.0], [36.1, 4173.0], [36.2, 4173.0], [36.3, 4176.0], [36.4, 4176.0], [36.5, 4176.0], [36.6, 4176.0], [36.7, 4176.0], [36.8, 4178.0], [36.9, 4178.0], [37.0, 4179.0], [37.1, 4179.0], [37.2, 4179.0], [37.3, 4341.0], [37.4, 4341.0], [37.5, 4343.0], [37.6, 4343.0], [37.7, 4343.0], [37.8, 4343.0], [37.9, 4343.0], [38.0, 4343.0], [38.1, 4343.0], [38.2, 4343.0], [38.3, 4343.0], [38.4, 4343.0], [38.5, 4344.0], [38.6, 4344.0], [38.7, 4344.0], [38.8, 4344.0], [38.9, 4344.0], [39.0, 4344.0], [39.1, 4344.0], [39.2, 4344.0], [39.3, 4344.0], [39.4, 4344.0], [39.5, 4344.0], [39.6, 4344.0], [39.7, 4344.0], [39.8, 4344.0], [39.9, 4344.0], [40.0, 4345.0], [40.1, 4345.0], [40.2, 4345.0], [40.3, 4345.0], [40.4, 4345.0], [40.5, 4346.0], [40.6, 4346.0], [40.7, 4346.0], [40.8, 4346.0], [40.9, 4346.0], [41.0, 4347.0], [41.1, 4347.0], [41.2, 4347.0], [41.3, 4347.0], [41.4, 4347.0], [41.5, 4347.0], [41.6, 4347.0], [41.7, 4347.0], [41.8, 4381.0], [41.9, 4381.0], [42.0, 4454.0], [42.1, 4454.0], [42.2, 4454.0], [42.3, 4465.0], [42.4, 4465.0], [42.5, 4511.0], [42.6, 4511.0], [42.7, 4511.0], [42.8, 4511.0], [42.9, 4511.0], [43.0, 4514.0], [43.1, 4514.0], [43.2, 4514.0], [43.3, 4665.0], [43.4, 4665.0], [43.5, 4667.0], [43.6, 4667.0], [43.7, 4667.0], [43.8, 4668.0], [43.9, 4668.0], [44.0, 4668.0], [44.1, 4668.0], [44.2, 4668.0], [44.3, 4668.0], [44.4, 4668.0], [44.5, 4674.0], [44.6, 4674.0], [44.7, 4674.0], [44.8, 4674.0], [44.9, 4674.0], [45.0, 4674.0], [45.1, 4674.0], [45.2, 4674.0], [45.3, 4674.0], [45.4, 4674.0], [45.5, 4674.0], [45.6, 4674.0], [45.7, 4674.0], [45.8, 4675.0], [45.9, 4675.0], [46.0, 4675.0], [46.1, 4675.0], [46.2, 4675.0], [46.3, 4676.0], [46.4, 4676.0], [46.5, 4676.0], [46.6, 4676.0], [46.7, 4676.0], [46.8, 4676.0], [46.9, 4676.0], [47.0, 4677.0], [47.1, 4677.0], [47.2, 4677.0], [47.3, 4678.0], [47.4, 4678.0], [47.5, 4678.0], [47.6, 4678.0], [47.7, 4678.0], [47.8, 4678.0], [47.9, 4678.0], [48.0, 4679.0], [48.1, 4679.0], [48.2, 4679.0], [48.3, 4679.0], [48.4, 4679.0], [48.5, 4679.0], [48.6, 4679.0], [48.7, 4679.0], [48.8, 4679.0], [48.9, 4679.0], [49.0, 4680.0], [49.1, 4680.0], [49.2, 4680.0], [49.3, 4681.0], [49.4, 4681.0], [49.5, 4713.0], [49.6, 4713.0], [49.7, 4713.0], [49.8, 4792.0], [49.9, 4792.0], [50.0, 4853.0], [50.1, 4853.0], [50.2, 4853.0], [50.3, 4855.0], [50.4, 4855.0], [50.5, 4855.0], [50.6, 4855.0], [50.7, 4855.0], [50.8, 4855.0], [50.9, 4855.0], [51.0, 4855.0], [51.1, 4855.0], [51.2, 4855.0], [51.3, 4856.0], [51.4, 4856.0], [51.5, 4856.0], [51.6, 4856.0], [51.7, 4856.0], [51.8, 4857.0], [51.9, 4857.0], [52.0, 4857.0], [52.1, 4857.0], [52.2, 4857.0], [52.3, 4858.0], [52.4, 4858.0], [52.5, 4858.0], [52.6, 4858.0], [52.7, 4858.0], [52.8, 4858.0], [52.9, 4858.0], [53.0, 4859.0], [53.1, 4859.0], [53.2, 4859.0], [53.3, 4954.0], [53.4, 4954.0], [53.5, 5004.0], [53.6, 5004.0], [53.7, 5004.0], [53.8, 5005.0], [53.9, 5005.0], [54.0, 5006.0], [54.1, 5006.0], [54.2, 5006.0], [54.3, 5007.0], [54.4, 5007.0], [54.5, 5007.0], [54.6, 5007.0], [54.7, 5007.0], [54.8, 5047.0], [54.9, 5047.0], [55.0, 5167.0], [55.1, 5167.0], [55.2, 5167.0], [55.3, 5168.0], [55.4, 5168.0], [55.5, 5168.0], [55.6, 5168.0], [55.7, 5168.0], [55.8, 5169.0], [55.9, 5169.0], [56.0, 5169.0], [56.1, 5169.0], [56.2, 5169.0], [56.3, 5170.0], [56.4, 5170.0], [56.5, 5185.0], [56.6, 5185.0], [56.7, 5185.0], [56.8, 5187.0], [56.9, 5187.0], [57.0, 5187.0], [57.1, 5187.0], [57.2, 5187.0], [57.3, 5189.0], [57.4, 5189.0], [57.5, 5190.0], [57.6, 5190.0], [57.7, 5190.0], [57.8, 5193.0], [57.9, 5193.0], [58.0, 5194.0], [58.1, 5194.0], [58.2, 5194.0], [58.3, 5195.0], [58.4, 5195.0], [58.5, 5195.0], [58.6, 5195.0], [58.7, 5195.0], [58.8, 5196.0], [58.9, 5196.0], [59.0, 5196.0], [59.1, 5196.0], [59.2, 5196.0], [59.3, 5197.0], [59.4, 5197.0], [59.5, 5197.0], [59.6, 5197.0], [59.7, 5197.0], [59.8, 5197.0], [59.9, 5197.0], [60.0, 5197.0], [60.1, 5197.0], [60.2, 5197.0], [60.3, 5197.0], [60.4, 5197.0], [60.5, 5206.0], [60.6, 5206.0], [60.7, 5206.0], [60.8, 5208.0], [60.9, 5208.0], [61.0, 5210.0], [61.1, 5210.0], [61.2, 5210.0], [61.3, 5283.0], [61.4, 5283.0], [61.5, 5325.0], [61.6, 5325.0], [61.7, 5325.0], [61.8, 5327.0], [61.9, 5327.0], [62.0, 5328.0], [62.1, 5328.0], [62.2, 5328.0], [62.3, 5328.0], [62.4, 5328.0], [62.5, 5329.0], [62.6, 5329.0], [62.7, 5329.0], [62.8, 5330.0], [62.9, 5330.0], [63.0, 5331.0], [63.1, 5331.0], [63.2, 5331.0], [63.3, 5333.0], [63.4, 5333.0], [63.5, 5333.0], [63.6, 5333.0], [63.7, 5333.0], [63.8, 5333.0], [63.9, 5333.0], [64.0, 5333.0], [64.1, 5333.0], [64.2, 5333.0], [64.3, 5334.0], [64.4, 5334.0], [64.5, 5334.0], [64.6, 5334.0], [64.7, 5334.0], [64.8, 5334.0], [64.9, 5334.0], [65.0, 5334.0], [65.1, 5334.0], [65.2, 5334.0], [65.3, 5342.0], [65.4, 5342.0], [65.5, 5476.0], [65.6, 5476.0], [65.7, 5476.0], [65.8, 5476.0], [65.9, 5476.0], [66.0, 5477.0], [66.1, 5477.0], [66.2, 5477.0], [66.3, 5477.0], [66.4, 5477.0], [66.5, 5477.0], [66.6, 5477.0], [66.7, 5477.0], [66.8, 5477.0], [66.9, 5477.0], [67.0, 5477.0], [67.1, 5477.0], [67.2, 5477.0], [67.3, 5478.0], [67.4, 5478.0], [67.5, 5479.0], [67.6, 5479.0], [67.7, 5479.0], [67.8, 5483.0], [67.9, 5483.0], [68.0, 5493.0], [68.1, 5493.0], [68.2, 5493.0], [68.3, 5495.0], [68.4, 5495.0], [68.5, 5517.0], [68.6, 5517.0], [68.7, 5517.0], [68.8, 5518.0], [68.9, 5518.0], [69.0, 5615.0], [69.1, 5615.0], [69.2, 5615.0], [69.3, 5632.0], [69.4, 5632.0], [69.5, 5648.0], [69.6, 5648.0], [69.7, 5648.0], [69.8, 5649.0], [69.9, 5649.0], [70.0, 5650.0], [70.1, 5650.0], [70.2, 5650.0], [70.3, 5651.0], [70.4, 5651.0], [70.5, 5651.0], [70.6, 5651.0], [70.7, 5651.0], [70.8, 5652.0], [70.9, 5652.0], [71.0, 5652.0], [71.1, 5652.0], [71.2, 5652.0], [71.3, 5652.0], [71.4, 5652.0], [71.5, 5653.0], [71.6, 5653.0], [71.7, 5653.0], [71.8, 5653.0], [71.9, 5653.0], [72.0, 5654.0], [72.1, 5654.0], [72.2, 5654.0], [72.3, 5654.0], [72.4, 5654.0], [72.5, 5654.0], [72.6, 5654.0], [72.7, 5654.0], [72.8, 5655.0], [72.9, 5655.0], [73.0, 5655.0], [73.1, 5655.0], [73.2, 5655.0], [73.3, 5656.0], [73.4, 5656.0], [73.5, 5657.0], [73.6, 5657.0], [73.7, 5657.0], [73.8, 5659.0], [73.9, 5659.0], [74.0, 5662.0], [74.1, 5662.0], [74.2, 5662.0], [74.3, 5764.0], [74.4, 5764.0], [74.5, 5765.0], [74.6, 5765.0], [74.7, 5765.0], [74.8, 5765.0], [74.9, 5765.0], [75.0, 5765.0], [75.1, 5765.0], [75.2, 5765.0], [75.3, 5766.0], [75.4, 5766.0], [75.5, 5766.0], [75.6, 5766.0], [75.7, 5766.0], [75.8, 5767.0], [75.9, 5767.0], [76.0, 5768.0], [76.1, 5768.0], [76.2, 5768.0], [76.3, 5768.0], [76.4, 5768.0], [76.5, 5769.0], [76.6, 5769.0], [76.7, 5769.0], [76.8, 5769.0], [76.9, 5769.0], [77.0, 5770.0], [77.1, 5770.0], [77.2, 5770.0], [77.3, 5771.0], [77.4, 5771.0], [77.5, 5771.0], [77.6, 5771.0], [77.7, 5771.0], [77.8, 5772.0], [77.9, 5772.0], [78.0, 5795.0], [78.1, 5795.0], [78.2, 5795.0], [78.3, 5969.0], [78.4, 5969.0], [78.5, 5986.0], [78.6, 5986.0], [78.7, 5986.0], [78.8, 5986.0], [78.9, 5986.0], [79.0, 5987.0], [79.1, 5987.0], [79.2, 5987.0], [79.3, 5987.0], [79.4, 5987.0], [79.5, 5988.0], [79.6, 5988.0], [79.7, 5988.0], [79.8, 5988.0], [79.9, 5988.0], [80.0, 5988.0], [80.1, 5988.0], [80.2, 5988.0], [80.3, 5988.0], [80.4, 5988.0], [80.5, 5989.0], [80.6, 5989.0], [80.7, 5989.0], [80.8, 5989.0], [80.9, 5989.0], [81.0, 5989.0], [81.1, 5989.0], [81.2, 5989.0], [81.3, 5989.0], [81.4, 5989.0], [81.5, 5989.0], [81.6, 5989.0], [81.7, 5989.0], [81.8, 5989.0], [81.9, 5989.0], [82.0, 5990.0], [82.1, 5990.0], [82.2, 5990.0], [82.3, 5990.0], [82.4, 5990.0], [82.5, 5990.0], [82.6, 5990.0], [82.7, 5990.0], [82.8, 5990.0], [82.9, 5990.0], [83.0, 5990.0], [83.1, 5990.0], [83.2, 5990.0], [83.3, 5990.0], [83.4, 5990.0], [83.5, 5991.0], [83.6, 5991.0], [83.7, 5991.0], [83.8, 5991.0], [83.9, 5991.0], [84.0, 5991.0], [84.1, 5991.0], [84.2, 5991.0], [84.3, 5991.0], [84.4, 5991.0], [84.5, 5991.0], [84.6, 5991.0], [84.7, 5991.0], [84.8, 5992.0], [84.9, 5992.0], [85.0, 5992.0], [85.1, 5992.0], [85.2, 5992.0], [85.3, 5992.0], [85.4, 5992.0], [85.5, 5992.0], [85.6, 5992.0], [85.7, 5992.0], [85.8, 5993.0], [85.9, 5993.0], [86.0, 5993.0], [86.1, 5993.0], [86.2, 5993.0], [86.3, 5993.0], [86.4, 5993.0], [86.5, 5993.0], [86.6, 5993.0], [86.7, 5993.0], [86.8, 5993.0], [86.9, 5993.0], [87.0, 5994.0], [87.1, 5994.0], [87.2, 5994.0], [87.3, 5994.0], [87.4, 5994.0], [87.5, 5994.0], [87.6, 5994.0], [87.7, 5994.0], [87.8, 5994.0], [87.9, 5994.0], [88.0, 5994.0], [88.1, 5994.0], [88.2, 5994.0], [88.3, 5995.0], [88.4, 5995.0], [88.5, 5995.0], [88.6, 5995.0], [88.7, 5995.0], [88.8, 5996.0], [88.9, 5996.0], [89.0, 6027.0], [89.1, 6027.0], [89.2, 6027.0], [89.3, 6027.0], [89.4, 6027.0], [89.5, 6027.0], [89.6, 6027.0], [89.7, 6027.0], [89.8, 6027.0], [89.9, 6027.0], [90.0, 6028.0], [90.1, 6028.0], [90.2, 6028.0], [90.3, 6031.0], [90.4, 6031.0], [90.5, 6031.0], [90.6, 6031.0], [90.7, 6031.0], [90.8, 6031.0], [90.9, 6031.0], [91.0, 6094.0], [91.1, 6094.0], [91.2, 6094.0], [91.3, 6094.0], [91.4, 6094.0], [91.5, 6095.0], [91.6, 6095.0], [91.7, 6095.0], [91.8, 6096.0], [91.9, 6096.0], [92.0, 6096.0], [92.1, 6096.0], [92.2, 6096.0], [92.3, 6096.0], [92.4, 6096.0], [92.5, 6097.0], [92.6, 6097.0], [92.7, 6097.0], [92.8, 6097.0], [92.9, 6097.0], [93.0, 6097.0], [93.1, 6097.0], [93.2, 6097.0], [93.3, 6097.0], [93.4, 6097.0], [93.5, 6098.0], [93.6, 6098.0], [93.7, 6098.0], [93.8, 6098.0], [93.9, 6098.0], [94.0, 6098.0], [94.1, 6098.0], [94.2, 6098.0], [94.3, 6099.0], [94.4, 6099.0], [94.5, 6099.0], [94.6, 6099.0], [94.7, 6099.0], [94.8, 6099.0], [94.9, 6099.0], [95.0, 6101.0], [95.1, 6101.0], [95.2, 6101.0], [95.3, 6101.0], [95.4, 6101.0], [95.5, 6104.0], [95.6, 6104.0], [95.7, 6104.0], [95.8, 6128.0], [95.9, 6128.0], [96.0, 6151.0], [96.1, 6151.0], [96.2, 6151.0], [96.3, 6190.0], [96.4, 6190.0], [96.5, 6315.0], [96.6, 6315.0], [96.7, 6315.0], [96.8, 6315.0], [96.9, 6315.0], [97.0, 6317.0], [97.1, 6317.0], [97.2, 6317.0], [97.3, 6317.0], [97.4, 6317.0], [97.5, 6317.0], [97.6, 6317.0], [97.7, 6317.0], [97.8, 6360.0], [97.9, 6360.0], [98.0, 6459.0], [98.1, 6459.0], [98.2, 6459.0], [98.3, 7287.0], [98.4, 7287.0], [98.5, 7618.0], [98.6, 7618.0], [98.7, 7618.0], [98.8, 7946.0], [98.9, 7946.0], [99.0, 8281.0], [99.1, 8281.0], [99.2, 8281.0], [99.3, 8281.0], [99.4, 8281.0], [99.5, 8615.0], [99.6, 8615.0], [99.7, 8615.0], [99.8, 8950.0], [99.9, 8950.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 200.0, "maxY": 43.0, "series": [{"data": [[600.0, 3.0], [700.0, 1.0], [900.0, 6.0], [1000.0, 1.0], [1100.0, 3.0], [1200.0, 1.0], [1300.0, 2.0], [1400.0, 5.0], [1500.0, 5.0], [1600.0, 3.0], [1700.0, 1.0], [1800.0, 11.0], [1900.0, 1.0], [2000.0, 2.0], [2100.0, 2.0], [2300.0, 11.0], [2500.0, 1.0], [2600.0, 6.0], [2800.0, 8.0], [2900.0, 3.0], [3000.0, 4.0], [3100.0, 9.0], [3300.0, 12.0], [3400.0, 5.0], [3500.0, 5.0], [3600.0, 3.0], [3800.0, 5.0], [3900.0, 5.0], [4000.0, 2.0], [4100.0, 10.0], [4300.0, 19.0], [4400.0, 2.0], [4600.0, 25.0], [4500.0, 3.0], [4700.0, 2.0], [4800.0, 13.0], [4900.0, 1.0], [5000.0, 6.0], [5100.0, 22.0], [5200.0, 4.0], [5300.0, 16.0], [5600.0, 21.0], [5400.0, 12.0], [5500.0, 2.0], [5700.0, 16.0], [5900.0, 43.0], [6100.0, 6.0], [6000.0, 24.0], [6300.0, 6.0], [6400.0, 1.0], [7200.0, 1.0], [7600.0, 1.0], [7900.0, 1.0], [8600.0, 1.0], [8200.0, 2.0], [8900.0, 1.0], [200.0, 3.0], [300.0, 4.0], [400.0, 1.0], [500.0, 5.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 8900.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 8.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 364.0, "series": [{"data": [[0.0, 8.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 28.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 364.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 25.643243243243237, "minX": 1.75107906E12, "maxY": 26.627906976744192, "series": [{"data": [[1.75107912E12, 26.627906976744192], [1.75107906E12, 25.643243243243237]], "isOverall": false, "label": "Auth Test Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107912E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 651.0, "minX": 1.0, "maxY": 6060.071428571427, "series": [{"data": [[2.0, 682.0], [32.0, 5442.5999999999985], [33.0, 4981.666666666667], [34.0, 5881.473684210526], [35.0, 4499.25], [36.0, 6060.071428571427], [37.0, 4984.333333333333], [38.0, 5002.666666666666], [3.0, 683.75], [4.0, 800.75], [5.0, 804.25], [6.0, 1085.0], [7.0, 1179.75], [8.0, 1374.25], [9.0, 1791.857142857143], [10.0, 2108.375], [11.0, 1628.2], [12.0, 2229.666666666667], [13.0, 2040.6], [14.0, 2178.3333333333335], [15.0, 2433.4], [1.0, 651.0], [16.0, 2772.25], [17.0, 2926.6000000000004], [18.0, 3667.1428571428573], [19.0, 2836.0], [20.0, 3807.875], [21.0, 2853.1428571428573], [22.0, 3996.2], [23.0, 3297.4], [24.0, 3616.6666666666665], [25.0, 4313.384615384615], [26.0, 4336.055555555555], [27.0, 4315.714285714286], [28.0, 4979.666666666666], [29.0, 4920.555555555555], [30.0, 3956.5], [31.0, 5394.799999999998]], "isOverall": false, "label": "Login Request", "isController": false}, {"data": [[26.172499999999985, 4361.872499999996]], "isOverall": false, "label": "Login Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 38.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 699.9166666666666, "minX": 1.75107906E12, "maxY": 1927.8333333333333, "series": [{"data": [[1.75107912E12, 1927.8333333333333], [1.75107906E12, 1658.8333333333333]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.75107912E12, 813.4166666666666], [1.75107906E12, 699.9166666666666]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107912E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 3681.9189189189206, "minX": 1.75107906E12, "maxY": 4946.948837209305, "series": [{"data": [[1.75107912E12, 4946.948837209305], [1.75107906E12, 3681.9189189189206]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107912E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 3681.7837837837833, "minX": 1.75107906E12, "maxY": 4946.762790697673, "series": [{"data": [[1.75107912E12, 4946.762790697673], [1.75107906E12, 3681.7837837837833]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107912E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.0, "minX": 1.75107906E12, "maxY": 0.2216216216216216, "series": [{"data": [[1.75107912E12, 0.0], [1.75107906E12, 0.2216216216216216]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107912E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 211.0, "minX": 1.75107906E12, "maxY": 8950.0, "series": [{"data": [[1.75107912E12, 6104.0], [1.75107906E12, 8950.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.75107912E12, 1514.0], [1.75107906E12, 211.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.75107912E12, 6031.0], [1.75107906E12, 6027.4]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.75107912E12, 6101.0], [1.75107906E12, 8661.899999999996]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.75107912E12, 5197.0], [1.75107906E12, 3642.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.75107912E12, 6097.0], [1.75107906E12, 6347.099999999999]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107912E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 219.0, "minX": 4.0, "maxY": 4858.5, "series": [{"data": [[4.0, 219.0], [5.0, 4569.5], [6.0, 4858.5], [7.0, 3749.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 7.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 217.0, "minX": 4.0, "maxY": 4858.5, "series": [{"data": [[4.0, 217.0], [5.0, 4569.0], [6.0, 4858.5], [7.0, 3749.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 7.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 2.9833333333333334, "minX": 1.75107906E12, "maxY": 3.683333333333333, "series": [{"data": [[1.75107912E12, 2.9833333333333334], [1.75107906E12, 3.683333333333333]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107912E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 3.0833333333333335, "minX": 1.75107906E12, "maxY": 3.5833333333333335, "series": [{"data": [[1.75107912E12, 3.5833333333333335], [1.75107906E12, 3.0833333333333335]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107912E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 3.0833333333333335, "minX": 1.75107906E12, "maxY": 3.5833333333333335, "series": [{"data": [[1.75107912E12, 3.5833333333333335], [1.75107906E12, 3.0833333333333335]], "isOverall": false, "label": "Login Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107912E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 3.0833333333333335, "minX": 1.75107906E12, "maxY": 3.5833333333333335, "series": [{"data": [[1.75107912E12, 3.5833333333333335], [1.75107906E12, 3.0833333333333335]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107912E12, "title": "Total Transactions Per Second"}},
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

