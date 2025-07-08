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
        data: {"result": {"minY": 167.0, "minX": 0.0, "maxY": 1105.0, "series": [{"data": [[0.0, 167.0], [0.1, 167.0], [0.2, 167.0], [0.3, 167.0], [0.4, 167.0], [0.5, 167.0], [0.6, 167.0], [0.7, 167.0], [0.8, 167.0], [0.9, 167.0], [1.0, 167.0], [1.1, 167.0], [1.2, 168.0], [1.3, 168.0], [1.4, 168.0], [1.5, 168.0], [1.6, 168.0], [1.7, 168.0], [1.8, 168.0], [1.9, 168.0], [2.0, 168.0], [2.1, 168.0], [2.2, 169.0], [2.3, 169.0], [2.4, 169.0], [2.5, 169.0], [2.6, 169.0], [2.7, 169.0], [2.8, 169.0], [2.9, 169.0], [3.0, 169.0], [3.1, 169.0], [3.2, 169.0], [3.3, 169.0], [3.4, 169.0], [3.5, 169.0], [3.6, 169.0], [3.7, 169.0], [3.8, 169.0], [3.9, 169.0], [4.0, 169.0], [4.1, 169.0], [4.2, 169.0], [4.3, 169.0], [4.4, 169.0], [4.5, 169.0], [4.6, 169.0], [4.7, 169.0], [4.8, 169.0], [4.9, 169.0], [5.0, 169.0], [5.1, 169.0], [5.2, 169.0], [5.3, 169.0], [5.4, 170.0], [5.5, 170.0], [5.6, 170.0], [5.7, 170.0], [5.8, 170.0], [5.9, 170.0], [6.0, 170.0], [6.1, 170.0], [6.2, 170.0], [6.3, 170.0], [6.4, 170.0], [6.5, 170.0], [6.6, 170.0], [6.7, 170.0], [6.8, 170.0], [6.9, 171.0], [7.0, 171.0], [7.1, 171.0], [7.2, 171.0], [7.3, 171.0], [7.4, 171.0], [7.5, 171.0], [7.6, 171.0], [7.7, 172.0], [7.8, 172.0], [7.9, 172.0], [8.0, 172.0], [8.1, 172.0], [8.2, 172.0], [8.3, 172.0], [8.4, 173.0], [8.5, 173.0], [8.6, 173.0], [8.7, 173.0], [8.8, 173.0], [8.9, 173.0], [9.0, 173.0], [9.1, 173.0], [9.2, 173.0], [9.3, 173.0], [9.4, 173.0], [9.5, 173.0], [9.6, 173.0], [9.7, 173.0], [9.8, 173.0], [9.9, 173.0], [10.0, 174.0], [10.1, 174.0], [10.2, 175.0], [10.3, 175.0], [10.4, 175.0], [10.5, 175.0], [10.6, 175.0], [10.7, 175.0], [10.8, 175.0], [10.9, 175.0], [11.0, 176.0], [11.1, 176.0], [11.2, 176.0], [11.3, 176.0], [11.4, 176.0], [11.5, 176.0], [11.6, 177.0], [11.7, 177.0], [11.8, 177.0], [11.9, 177.0], [12.0, 177.0], [12.1, 177.0], [12.2, 177.0], [12.3, 177.0], [12.4, 178.0], [12.5, 178.0], [12.6, 178.0], [12.7, 178.0], [12.8, 178.0], [12.9, 178.0], [13.0, 178.0], [13.1, 178.0], [13.2, 178.0], [13.3, 178.0], [13.4, 178.0], [13.5, 178.0], [13.6, 178.0], [13.7, 178.0], [13.8, 179.0], [13.9, 179.0], [14.0, 179.0], [14.1, 179.0], [14.2, 179.0], [14.3, 179.0], [14.4, 179.0], [14.5, 179.0], [14.6, 179.0], [14.7, 179.0], [14.8, 179.0], [14.9, 179.0], [15.0, 180.0], [15.1, 180.0], [15.2, 181.0], [15.3, 181.0], [15.4, 182.0], [15.5, 182.0], [15.6, 182.0], [15.7, 182.0], [15.8, 182.0], [15.9, 182.0], [16.0, 183.0], [16.1, 183.0], [16.2, 183.0], [16.3, 183.0], [16.4, 183.0], [16.5, 183.0], [16.6, 183.0], [16.7, 183.0], [16.8, 185.0], [16.9, 185.0], [17.0, 186.0], [17.1, 186.0], [17.2, 186.0], [17.3, 186.0], [17.4, 186.0], [17.5, 186.0], [17.6, 186.0], [17.7, 186.0], [17.8, 188.0], [17.9, 188.0], [18.0, 190.0], [18.1, 190.0], [18.2, 194.0], [18.3, 194.0], [18.4, 195.0], [18.5, 195.0], [18.6, 196.0], [18.7, 196.0], [18.8, 196.0], [18.9, 196.0], [19.0, 197.0], [19.1, 197.0], [19.2, 198.0], [19.3, 198.0], [19.4, 198.0], [19.5, 198.0], [19.6, 198.0], [19.7, 198.0], [19.8, 199.0], [19.9, 199.0], [20.0, 200.0], [20.1, 200.0], [20.2, 200.0], [20.3, 200.0], [20.4, 200.0], [20.5, 200.0], [20.6, 200.0], [20.7, 200.0], [20.8, 201.0], [20.9, 201.0], [21.0, 201.0], [21.1, 201.0], [21.2, 202.0], [21.3, 202.0], [21.4, 202.0], [21.5, 202.0], [21.6, 203.0], [21.7, 203.0], [21.8, 205.0], [21.9, 205.0], [22.0, 205.0], [22.1, 205.0], [22.2, 206.0], [22.3, 206.0], [22.4, 206.0], [22.5, 206.0], [22.6, 207.0], [22.7, 207.0], [22.8, 207.0], [22.9, 207.0], [23.0, 207.0], [23.1, 207.0], [23.2, 208.0], [23.3, 208.0], [23.4, 208.0], [23.5, 208.0], [23.6, 208.0], [23.7, 208.0], [23.8, 208.0], [23.9, 208.0], [24.0, 208.0], [24.1, 208.0], [24.2, 208.0], [24.3, 208.0], [24.4, 208.0], [24.5, 208.0], [24.6, 208.0], [24.7, 208.0], [24.8, 208.0], [24.9, 208.0], [25.0, 208.0], [25.1, 208.0], [25.2, 209.0], [25.3, 209.0], [25.4, 209.0], [25.5, 209.0], [25.6, 209.0], [25.7, 209.0], [25.8, 209.0], [25.9, 209.0], [26.0, 209.0], [26.1, 209.0], [26.2, 209.0], [26.3, 209.0], [26.4, 209.0], [26.5, 209.0], [26.6, 209.0], [26.7, 209.0], [26.8, 209.0], [26.9, 209.0], [27.0, 209.0], [27.1, 209.0], [27.2, 209.0], [27.3, 209.0], [27.4, 209.0], [27.5, 209.0], [27.6, 210.0], [27.7, 210.0], [27.8, 210.0], [27.9, 210.0], [28.0, 210.0], [28.1, 210.0], [28.2, 210.0], [28.3, 210.0], [28.4, 210.0], [28.5, 210.0], [28.6, 210.0], [28.7, 210.0], [28.8, 210.0], [28.9, 210.0], [29.0, 210.0], [29.1, 210.0], [29.2, 210.0], [29.3, 210.0], [29.4, 210.0], [29.5, 210.0], [29.6, 210.0], [29.7, 210.0], [29.8, 210.0], [29.9, 210.0], [30.0, 211.0], [30.1, 211.0], [30.2, 211.0], [30.3, 211.0], [30.4, 211.0], [30.5, 211.0], [30.6, 211.0], [30.7, 211.0], [30.8, 211.0], [30.9, 211.0], [31.0, 211.0], [31.1, 211.0], [31.2, 211.0], [31.3, 211.0], [31.4, 211.0], [31.5, 211.0], [31.6, 211.0], [31.7, 211.0], [31.8, 211.0], [31.9, 211.0], [32.0, 211.0], [32.1, 211.0], [32.2, 211.0], [32.3, 211.0], [32.4, 211.0], [32.5, 211.0], [32.6, 211.0], [32.7, 211.0], [32.8, 211.0], [32.9, 211.0], [33.0, 211.0], [33.1, 211.0], [33.2, 211.0], [33.3, 211.0], [33.4, 212.0], [33.5, 212.0], [33.6, 212.0], [33.7, 212.0], [33.8, 212.0], [33.9, 212.0], [34.0, 212.0], [34.1, 212.0], [34.2, 212.0], [34.3, 212.0], [34.4, 212.0], [34.5, 212.0], [34.6, 212.0], [34.7, 212.0], [34.8, 212.0], [34.9, 212.0], [35.0, 212.0], [35.1, 212.0], [35.2, 213.0], [35.3, 213.0], [35.4, 213.0], [35.5, 213.0], [35.6, 213.0], [35.7, 213.0], [35.8, 213.0], [35.9, 213.0], [36.0, 213.0], [36.1, 213.0], [36.2, 214.0], [36.3, 214.0], [36.4, 214.0], [36.5, 214.0], [36.6, 214.0], [36.7, 214.0], [36.8, 215.0], [36.9, 215.0], [37.0, 215.0], [37.1, 215.0], [37.2, 215.0], [37.3, 215.0], [37.4, 215.0], [37.5, 215.0], [37.6, 216.0], [37.7, 216.0], [37.8, 217.0], [37.9, 217.0], [38.0, 217.0], [38.1, 217.0], [38.2, 217.0], [38.3, 217.0], [38.4, 218.0], [38.5, 218.0], [38.6, 219.0], [38.7, 219.0], [38.8, 221.0], [38.9, 221.0], [39.0, 224.0], [39.1, 224.0], [39.2, 225.0], [39.3, 225.0], [39.4, 228.0], [39.5, 228.0], [39.6, 230.0], [39.7, 230.0], [39.8, 230.0], [39.9, 231.0], [40.0, 231.0], [40.1, 232.0], [40.2, 232.0], [40.3, 233.0], [40.4, 233.0], [40.5, 235.0], [40.6, 235.0], [40.7, 236.0], [40.8, 236.0], [40.9, 236.0], [41.0, 236.0], [41.1, 236.0], [41.2, 236.0], [41.3, 238.0], [41.4, 238.0], [41.5, 238.0], [41.6, 238.0], [41.7, 241.0], [41.8, 241.0], [41.9, 242.0], [42.0, 242.0], [42.1, 242.0], [42.2, 242.0], [42.3, 244.0], [42.4, 244.0], [42.5, 245.0], [42.6, 245.0], [42.7, 245.0], [42.8, 245.0], [42.9, 246.0], [43.0, 246.0], [43.1, 246.0], [43.2, 246.0], [43.3, 247.0], [43.4, 247.0], [43.5, 248.0], [43.6, 248.0], [43.7, 249.0], [43.8, 249.0], [43.9, 251.0], [44.0, 251.0], [44.1, 253.0], [44.2, 253.0], [44.3, 254.0], [44.4, 254.0], [44.5, 254.0], [44.6, 254.0], [44.7, 257.0], [44.8, 257.0], [44.9, 258.0], [45.0, 258.0], [45.1, 258.0], [45.2, 258.0], [45.3, 259.0], [45.4, 259.0], [45.5, 259.0], [45.6, 259.0], [45.7, 262.0], [45.8, 262.0], [45.9, 262.0], [46.0, 262.0], [46.1, 265.0], [46.2, 265.0], [46.3, 266.0], [46.4, 266.0], [46.5, 266.0], [46.6, 266.0], [46.7, 267.0], [46.8, 267.0], [46.9, 267.0], [47.0, 267.0], [47.1, 268.0], [47.2, 268.0], [47.3, 268.0], [47.4, 268.0], [47.5, 268.0], [47.6, 268.0], [47.7, 268.0], [47.8, 268.0], [47.9, 268.0], [48.0, 268.0], [48.1, 269.0], [48.2, 269.0], [48.3, 270.0], [48.4, 270.0], [48.5, 271.0], [48.6, 271.0], [48.7, 272.0], [48.8, 272.0], [48.9, 274.0], [49.0, 274.0], [49.1, 274.0], [49.2, 274.0], [49.3, 275.0], [49.4, 275.0], [49.5, 277.0], [49.6, 277.0], [49.7, 277.0], [49.8, 277.0], [49.9, 278.0], [50.0, 278.0], [50.1, 279.0], [50.2, 279.0], [50.3, 279.0], [50.4, 279.0], [50.5, 282.0], [50.6, 282.0], [50.7, 283.0], [50.8, 283.0], [50.9, 285.0], [51.0, 285.0], [51.1, 288.0], [51.2, 288.0], [51.3, 289.0], [51.4, 289.0], [51.5, 290.0], [51.6, 290.0], [51.7, 290.0], [51.8, 290.0], [51.9, 294.0], [52.0, 294.0], [52.1, 295.0], [52.2, 295.0], [52.3, 296.0], [52.4, 296.0], [52.5, 296.0], [52.6, 296.0], [52.7, 297.0], [52.8, 297.0], [52.9, 297.0], [53.0, 297.0], [53.1, 298.0], [53.2, 298.0], [53.3, 298.0], [53.4, 298.0], [53.5, 301.0], [53.6, 301.0], [53.7, 303.0], [53.8, 303.0], [53.9, 304.0], [54.0, 304.0], [54.1, 304.0], [54.2, 304.0], [54.3, 306.0], [54.4, 306.0], [54.5, 310.0], [54.6, 310.0], [54.7, 312.0], [54.8, 312.0], [54.9, 314.0], [55.0, 314.0], [55.1, 314.0], [55.2, 314.0], [55.3, 315.0], [55.4, 315.0], [55.5, 325.0], [55.6, 325.0], [55.7, 327.0], [55.8, 327.0], [55.9, 328.0], [56.0, 328.0], [56.1, 328.0], [56.2, 328.0], [56.3, 329.0], [56.4, 329.0], [56.5, 330.0], [56.6, 330.0], [56.7, 331.0], [56.8, 331.0], [56.9, 331.0], [57.0, 331.0], [57.1, 331.0], [57.2, 331.0], [57.3, 332.0], [57.4, 332.0], [57.5, 332.0], [57.6, 332.0], [57.7, 333.0], [57.8, 333.0], [57.9, 333.0], [58.0, 333.0], [58.1, 333.0], [58.2, 333.0], [58.3, 333.0], [58.4, 333.0], [58.5, 333.0], [58.6, 333.0], [58.7, 334.0], [58.8, 334.0], [58.9, 334.0], [59.0, 334.0], [59.1, 334.0], [59.2, 334.0], [59.3, 334.0], [59.4, 334.0], [59.5, 334.0], [59.6, 334.0], [59.7, 334.0], [59.8, 334.0], [59.9, 334.0], [60.0, 334.0], [60.1, 335.0], [60.2, 335.0], [60.3, 335.0], [60.4, 335.0], [60.5, 335.0], [60.6, 335.0], [60.7, 335.0], [60.8, 335.0], [60.9, 335.0], [61.0, 335.0], [61.1, 335.0], [61.2, 335.0], [61.3, 335.0], [61.4, 335.0], [61.5, 335.0], [61.6, 335.0], [61.7, 335.0], [61.8, 335.0], [61.9, 335.0], [62.0, 335.0], [62.1, 335.0], [62.2, 335.0], [62.3, 335.0], [62.4, 335.0], [62.5, 336.0], [62.6, 336.0], [62.7, 336.0], [62.8, 336.0], [62.9, 336.0], [63.0, 336.0], [63.1, 337.0], [63.2, 337.0], [63.3, 337.0], [63.4, 337.0], [63.5, 337.0], [63.6, 337.0], [63.7, 337.0], [63.8, 337.0], [63.9, 337.0], [64.0, 337.0], [64.1, 337.0], [64.2, 337.0], [64.3, 337.0], [64.4, 337.0], [64.5, 337.0], [64.6, 337.0], [64.7, 338.0], [64.8, 338.0], [64.9, 338.0], [65.0, 338.0], [65.1, 338.0], [65.2, 338.0], [65.3, 338.0], [65.4, 338.0], [65.5, 339.0], [65.6, 339.0], [65.7, 339.0], [65.8, 339.0], [65.9, 340.0], [66.0, 340.0], [66.1, 341.0], [66.2, 341.0], [66.3, 341.0], [66.4, 341.0], [66.5, 341.0], [66.6, 341.0], [66.7, 341.0], [66.8, 341.0], [66.9, 341.0], [67.0, 341.0], [67.1, 342.0], [67.2, 342.0], [67.3, 342.0], [67.4, 342.0], [67.5, 342.0], [67.6, 342.0], [67.7, 342.0], [67.8, 342.0], [67.9, 343.0], [68.0, 343.0], [68.1, 344.0], [68.2, 344.0], [68.3, 345.0], [68.4, 345.0], [68.5, 345.0], [68.6, 345.0], [68.7, 345.0], [68.8, 345.0], [68.9, 346.0], [69.0, 346.0], [69.1, 346.0], [69.2, 346.0], [69.3, 348.0], [69.4, 348.0], [69.5, 348.0], [69.6, 348.0], [69.7, 349.0], [69.8, 349.0], [69.9, 350.0], [70.0, 350.0], [70.1, 350.0], [70.2, 350.0], [70.3, 352.0], [70.4, 352.0], [70.5, 352.0], [70.6, 352.0], [70.7, 352.0], [70.8, 352.0], [70.9, 356.0], [71.0, 356.0], [71.1, 357.0], [71.2, 357.0], [71.3, 357.0], [71.4, 357.0], [71.5, 357.0], [71.6, 357.0], [71.7, 358.0], [71.8, 358.0], [71.9, 359.0], [72.0, 359.0], [72.1, 361.0], [72.2, 361.0], [72.3, 361.0], [72.4, 361.0], [72.5, 370.0], [72.6, 370.0], [72.7, 371.0], [72.8, 371.0], [72.9, 372.0], [73.0, 372.0], [73.1, 372.0], [73.2, 372.0], [73.3, 372.0], [73.4, 372.0], [73.5, 372.0], [73.6, 372.0], [73.7, 375.0], [73.8, 375.0], [73.9, 376.0], [74.0, 376.0], [74.1, 377.0], [74.2, 377.0], [74.3, 377.0], [74.4, 377.0], [74.5, 378.0], [74.6, 378.0], [74.7, 381.0], [74.8, 381.0], [74.9, 381.0], [75.0, 381.0], [75.1, 382.0], [75.2, 382.0], [75.3, 382.0], [75.4, 382.0], [75.5, 383.0], [75.6, 383.0], [75.7, 385.0], [75.8, 385.0], [75.9, 385.0], [76.0, 385.0], [76.1, 388.0], [76.2, 388.0], [76.3, 390.0], [76.4, 390.0], [76.5, 391.0], [76.6, 391.0], [76.7, 393.0], [76.8, 393.0], [76.9, 399.0], [77.0, 399.0], [77.1, 404.0], [77.2, 404.0], [77.3, 405.0], [77.4, 405.0], [77.5, 405.0], [77.6, 405.0], [77.7, 408.0], [77.8, 408.0], [77.9, 411.0], [78.0, 411.0], [78.1, 412.0], [78.2, 412.0], [78.3, 414.0], [78.4, 414.0], [78.5, 417.0], [78.6, 417.0], [78.7, 426.0], [78.8, 426.0], [78.9, 426.0], [79.0, 426.0], [79.1, 429.0], [79.2, 429.0], [79.3, 432.0], [79.4, 432.0], [79.5, 433.0], [79.6, 433.0], [79.7, 434.0], [79.8, 434.0], [79.9, 435.0], [80.0, 435.0], [80.1, 437.0], [80.2, 437.0], [80.3, 438.0], [80.4, 438.0], [80.5, 440.0], [80.6, 440.0], [80.7, 441.0], [80.8, 441.0], [80.9, 443.0], [81.0, 443.0], [81.1, 444.0], [81.2, 444.0], [81.3, 449.0], [81.4, 449.0], [81.5, 454.0], [81.6, 454.0], [81.7, 459.0], [81.8, 459.0], [81.9, 459.0], [82.0, 459.0], [82.1, 463.0], [82.2, 463.0], [82.3, 463.0], [82.4, 463.0], [82.5, 466.0], [82.6, 466.0], [82.7, 470.0], [82.8, 470.0], [82.9, 474.0], [83.0, 474.0], [83.1, 477.0], [83.2, 477.0], [83.3, 478.0], [83.4, 478.0], [83.5, 479.0], [83.6, 479.0], [83.7, 482.0], [83.8, 482.0], [83.9, 483.0], [84.0, 483.0], [84.1, 494.0], [84.2, 494.0], [84.3, 495.0], [84.4, 495.0], [84.5, 496.0], [84.6, 496.0], [84.7, 497.0], [84.8, 497.0], [84.9, 497.0], [85.0, 497.0], [85.1, 499.0], [85.2, 499.0], [85.3, 500.0], [85.4, 500.0], [85.5, 503.0], [85.6, 503.0], [85.7, 503.0], [85.8, 503.0], [85.9, 503.0], [86.0, 503.0], [86.1, 503.0], [86.2, 503.0], [86.3, 504.0], [86.4, 504.0], [86.5, 504.0], [86.6, 504.0], [86.7, 504.0], [86.8, 504.0], [86.9, 505.0], [87.0, 505.0], [87.1, 506.0], [87.2, 506.0], [87.3, 510.0], [87.4, 510.0], [87.5, 510.0], [87.6, 510.0], [87.7, 511.0], [87.8, 511.0], [87.9, 513.0], [88.0, 513.0], [88.1, 514.0], [88.2, 514.0], [88.3, 519.0], [88.4, 519.0], [88.5, 526.0], [88.6, 526.0], [88.7, 532.0], [88.8, 532.0], [88.9, 533.0], [89.0, 533.0], [89.1, 536.0], [89.2, 536.0], [89.3, 537.0], [89.4, 537.0], [89.5, 538.0], [89.6, 538.0], [89.7, 562.0], [89.8, 562.0], [89.9, 567.0], [90.0, 567.0], [90.1, 569.0], [90.2, 569.0], [90.3, 572.0], [90.4, 572.0], [90.5, 579.0], [90.6, 579.0], [90.7, 601.0], [90.8, 601.0], [90.9, 604.0], [91.0, 604.0], [91.1, 605.0], [91.2, 605.0], [91.3, 628.0], [91.4, 628.0], [91.5, 632.0], [91.6, 632.0], [91.7, 633.0], [91.8, 633.0], [91.9, 634.0], [92.0, 634.0], [92.1, 635.0], [92.2, 635.0], [92.3, 640.0], [92.4, 640.0], [92.5, 644.0], [92.6, 644.0], [92.7, 654.0], [92.8, 654.0], [92.9, 670.0], [93.0, 670.0], [93.1, 675.0], [93.2, 675.0], [93.3, 675.0], [93.4, 675.0], [93.5, 678.0], [93.6, 678.0], [93.7, 695.0], [93.8, 695.0], [93.9, 699.0], [94.0, 699.0], [94.1, 731.0], [94.2, 731.0], [94.3, 739.0], [94.4, 739.0], [94.5, 740.0], [94.6, 740.0], [94.7, 764.0], [94.8, 764.0], [94.9, 767.0], [95.0, 767.0], [95.1, 768.0], [95.2, 768.0], [95.3, 771.0], [95.4, 771.0], [95.5, 793.0], [95.6, 793.0], [95.7, 800.0], [95.8, 800.0], [95.9, 814.0], [96.0, 814.0], [96.1, 829.0], [96.2, 829.0], [96.3, 832.0], [96.4, 832.0], [96.5, 834.0], [96.6, 834.0], [96.7, 853.0], [96.8, 853.0], [96.9, 862.0], [97.0, 862.0], [97.1, 863.0], [97.2, 863.0], [97.3, 869.0], [97.4, 869.0], [97.5, 869.0], [97.6, 869.0], [97.7, 871.0], [97.8, 871.0], [97.9, 880.0], [98.0, 880.0], [98.1, 893.0], [98.2, 893.0], [98.3, 906.0], [98.4, 906.0], [98.5, 907.0], [98.6, 907.0], [98.7, 926.0], [98.8, 926.0], [98.9, 938.0], [99.0, 938.0], [99.1, 967.0], [99.2, 967.0], [99.3, 1003.0], [99.4, 1003.0], [99.5, 1037.0], [99.6, 1037.0], [99.7, 1091.0], [99.8, 1091.0], [99.9, 1105.0], [100.0, 1105.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 100.0, "maxY": 167.0, "series": [{"data": [[1100.0, 1.0], [300.0, 118.0], [600.0, 17.0], [700.0, 8.0], [200.0, 167.0], [100.0, 100.0], [400.0, 41.0], [800.0, 13.0], [900.0, 5.0], [500.0, 27.0], [1000.0, 3.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 1100.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 73.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 427.0, "series": [{"data": [[0.0, 427.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 73.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 1.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 5.9714285714285715, "minX": 1.75107942E12, "maxY": 23.666666666666657, "series": [{"data": [[1.75107948E12, 23.666666666666657], [1.75107942E12, 5.9714285714285715], [1.75107954E12, 18.26143790849673]], "isOverall": false, "label": "Auth Test Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107954E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 204.5, "minX": 1.0, "maxY": 506.875, "series": [{"data": [[2.0, 204.5], [3.0, 237.4], [4.0, 289.75], [5.0, 268.6], [6.0, 383.5], [7.0, 340.83333333333337], [8.0, 275.0], [9.0, 318.8571428571429], [10.0, 426.33333333333337], [11.0, 376.6], [12.0, 348.625], [13.0, 357.875], [14.0, 434.0], [15.0, 506.875], [1.0, 268.6666666666667], [16.0, 314.45454545454544], [17.0, 398.29999999999995], [18.0, 417.3636363636364], [19.0, 389.25], [20.0, 353.00000000000006], [21.0, 375.45], [22.0, 339.19999999999993], [23.0, 324.18181818181824], [24.0, 317.9180327868852], [25.0, 315.9024390243902]], "isOverall": false, "label": "Login Request", "isController": false}, {"data": [[20.774000000000008, 333.6780000000001]], "isOverall": false, "label": "Login Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 25.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 132.41666666666666, "minX": 1.75107942E12, "maxY": 2797.6, "series": [{"data": [[1.75107948E12, 2797.6], [1.75107942E12, 313.8333333333333], [1.75107954E12, 1371.9]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.75107948E12, 1180.4], [1.75107942E12, 132.41666666666666], [1.75107954E12, 578.85]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107954E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 279.3267973856209, "minX": 1.75107942E12, "maxY": 361.7884615384615, "series": [{"data": [[1.75107948E12, 361.7884615384615], [1.75107942E12, 320.6857142857142], [1.75107954E12, 279.3267973856209]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107954E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 279.2941176470588, "minX": 1.75107942E12, "maxY": 361.7275641025641, "series": [{"data": [[1.75107948E12, 361.7275641025641], [1.75107942E12, 320.42857142857144], [1.75107954E12, 279.2941176470588]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107954E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.060897435897435924, "minX": 1.75107942E12, "maxY": 0.45714285714285713, "series": [{"data": [[1.75107948E12, 0.060897435897435924], [1.75107942E12, 0.45714285714285713], [1.75107954E12, 0.11764705882352937]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107954E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 167.0, "minX": 1.75107942E12, "maxY": 1105.0, "series": [{"data": [[1.75107948E12, 1105.0], [1.75107942E12, 634.0], [1.75107954E12, 579.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.75107948E12, 167.0], [1.75107942E12, 168.0], [1.75107954E12, 169.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.75107948E12, 697.8], [1.75107942E12, 455.79999999999995], [1.75107954E12, 413.2]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.75107948E12, 1032.5800000000002], [1.75107942E12, 634.0], [1.75107954E12, 543.9000000000005]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.75107948E12, 297.0], [1.75107942E12, 289.0], [1.75107954E12, 251.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.75107948E12, 862.3499999999999], [1.75107942E12, 555.5999999999996], [1.75107954E12, 479.9]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107954E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 205.0, "minX": 3.0, "maxY": 337.5, "series": [{"data": [[4.0, 230.5], [5.0, 259.0], [6.0, 337.5], [3.0, 205.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 205.0, "minX": 3.0, "maxY": 337.5, "series": [{"data": [[4.0, 230.5], [5.0, 259.0], [6.0, 337.5], [3.0, 205.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 0.6333333333333333, "minX": 1.75107942E12, "maxY": 5.183333333333334, "series": [{"data": [[1.75107948E12, 5.183333333333334], [1.75107942E12, 0.6333333333333333], [1.75107954E12, 2.5166666666666666]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107954E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 0.5833333333333334, "minX": 1.75107942E12, "maxY": 5.2, "series": [{"data": [[1.75107948E12, 5.2], [1.75107942E12, 0.5833333333333334], [1.75107954E12, 2.55]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107954E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 0.5833333333333334, "minX": 1.75107942E12, "maxY": 5.2, "series": [{"data": [[1.75107948E12, 5.2], [1.75107942E12, 0.5833333333333334], [1.75107954E12, 2.55]], "isOverall": false, "label": "Login Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107954E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 0.5833333333333334, "minX": 1.75107942E12, "maxY": 5.2, "series": [{"data": [[1.75107948E12, 5.2], [1.75107942E12, 0.5833333333333334], [1.75107954E12, 2.55]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107954E12, "title": "Total Transactions Per Second"}},
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

