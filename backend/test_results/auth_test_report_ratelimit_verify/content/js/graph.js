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
        data: {"result": {"minY": 168.0, "minX": 0.0, "maxY": 3179.0, "series": [{"data": [[0.0, 168.0], [0.1, 168.0], [0.2, 168.0], [0.3, 168.0], [0.4, 168.0], [0.5, 168.0], [0.6, 168.0], [0.7, 169.0], [0.8, 169.0], [0.9, 169.0], [1.0, 169.0], [1.1, 169.0], [1.2, 169.0], [1.3, 169.0], [1.4, 170.0], [1.5, 170.0], [1.6, 170.0], [1.7, 170.0], [1.8, 170.0], [1.9, 170.0], [2.0, 170.0], [2.1, 170.0], [2.2, 170.0], [2.3, 170.0], [2.4, 171.0], [2.5, 171.0], [2.6, 171.0], [2.7, 171.0], [2.8, 171.0], [2.9, 171.0], [3.0, 172.0], [3.1, 172.0], [3.2, 172.0], [3.3, 172.0], [3.4, 172.0], [3.5, 172.0], [3.6, 172.0], [3.7, 172.0], [3.8, 172.0], [3.9, 172.0], [4.0, 172.0], [4.1, 172.0], [4.2, 172.0], [4.3, 172.0], [4.4, 173.0], [4.5, 173.0], [4.6, 173.0], [4.7, 173.0], [4.8, 173.0], [4.9, 173.0], [5.0, 173.0], [5.1, 173.0], [5.2, 173.0], [5.3, 173.0], [5.4, 174.0], [5.5, 174.0], [5.6, 174.0], [5.7, 174.0], [5.8, 174.0], [5.9, 174.0], [6.0, 175.0], [6.1, 175.0], [6.2, 175.0], [6.3, 175.0], [6.4, 175.0], [6.5, 175.0], [6.6, 175.0], [6.7, 175.0], [6.8, 175.0], [6.9, 175.0], [7.0, 177.0], [7.1, 177.0], [7.2, 177.0], [7.3, 177.0], [7.4, 177.0], [7.5, 177.0], [7.6, 177.0], [7.7, 178.0], [7.8, 178.0], [7.9, 178.0], [8.0, 181.0], [8.1, 181.0], [8.2, 181.0], [8.3, 181.0], [8.4, 182.0], [8.5, 182.0], [8.6, 182.0], [8.7, 182.0], [8.8, 182.0], [8.9, 182.0], [9.0, 183.0], [9.1, 183.0], [9.2, 183.0], [9.3, 183.0], [9.4, 184.0], [9.5, 184.0], [9.6, 184.0], [9.7, 185.0], [9.8, 185.0], [9.9, 185.0], [10.0, 185.0], [10.1, 185.0], [10.2, 185.0], [10.3, 185.0], [10.4, 187.0], [10.5, 187.0], [10.6, 187.0], [10.7, 187.0], [10.8, 187.0], [10.9, 187.0], [11.0, 188.0], [11.1, 188.0], [11.2, 188.0], [11.3, 188.0], [11.4, 191.0], [11.5, 191.0], [11.6, 191.0], [11.7, 193.0], [11.8, 193.0], [11.9, 193.0], [12.0, 193.0], [12.1, 195.0], [12.2, 195.0], [12.3, 195.0], [12.4, 199.0], [12.5, 199.0], [12.6, 199.0], [12.7, 200.0], [12.8, 200.0], [12.9, 200.0], [13.0, 200.0], [13.1, 200.0], [13.2, 200.0], [13.3, 200.0], [13.4, 201.0], [13.5, 201.0], [13.6, 201.0], [13.7, 201.0], [13.8, 201.0], [13.9, 201.0], [14.0, 201.0], [14.1, 201.0], [14.2, 201.0], [14.3, 201.0], [14.4, 202.0], [14.5, 202.0], [14.6, 202.0], [14.7, 202.0], [14.8, 202.0], [14.9, 202.0], [15.0, 202.0], [15.1, 203.0], [15.2, 203.0], [15.3, 203.0], [15.4, 203.0], [15.5, 203.0], [15.6, 203.0], [15.7, 203.0], [15.8, 203.0], [15.9, 203.0], [16.0, 204.0], [16.1, 204.0], [16.2, 204.0], [16.3, 204.0], [16.4, 204.0], [16.5, 204.0], [16.6, 204.0], [16.7, 204.0], [16.8, 204.0], [16.9, 204.0], [17.0, 204.0], [17.1, 204.0], [17.2, 204.0], [17.3, 204.0], [17.4, 205.0], [17.5, 205.0], [17.6, 205.0], [17.7, 206.0], [17.8, 206.0], [17.9, 206.0], [18.0, 207.0], [18.1, 207.0], [18.2, 207.0], [18.3, 207.0], [18.4, 209.0], [18.5, 209.0], [18.6, 209.0], [18.7, 210.0], [18.8, 210.0], [18.9, 210.0], [19.0, 210.0], [19.1, 210.0], [19.2, 210.0], [19.3, 210.0], [19.4, 210.0], [19.5, 210.0], [19.6, 210.0], [19.7, 210.0], [19.8, 210.0], [19.9, 210.0], [20.0, 210.0], [20.1, 210.0], [20.2, 210.0], [20.3, 210.0], [20.4, 211.0], [20.5, 211.0], [20.6, 211.0], [20.7, 211.0], [20.8, 211.0], [20.9, 211.0], [21.0, 211.0], [21.1, 211.0], [21.2, 211.0], [21.3, 211.0], [21.4, 212.0], [21.5, 212.0], [21.6, 212.0], [21.7, 212.0], [21.8, 212.0], [21.9, 212.0], [22.0, 212.0], [22.1, 212.0], [22.2, 212.0], [22.3, 212.0], [22.4, 213.0], [22.5, 213.0], [22.6, 213.0], [22.7, 213.0], [22.8, 213.0], [22.9, 213.0], [23.0, 214.0], [23.1, 214.0], [23.2, 214.0], [23.3, 214.0], [23.4, 214.0], [23.5, 214.0], [23.6, 214.0], [23.7, 217.0], [23.8, 217.0], [23.9, 217.0], [24.0, 221.0], [24.1, 221.0], [24.2, 221.0], [24.3, 221.0], [24.4, 236.0], [24.5, 236.0], [24.6, 236.0], [24.7, 236.0], [24.8, 236.0], [24.9, 236.0], [25.0, 236.0], [25.1, 236.0], [25.2, 236.0], [25.3, 236.0], [25.4, 237.0], [25.5, 237.0], [25.6, 237.0], [25.7, 238.0], [25.8, 238.0], [25.9, 238.0], [26.0, 238.0], [26.1, 238.0], [26.2, 238.0], [26.3, 238.0], [26.4, 240.0], [26.5, 240.0], [26.6, 240.0], [26.7, 240.0], [26.8, 240.0], [26.9, 240.0], [27.0, 241.0], [27.1, 241.0], [27.2, 241.0], [27.3, 241.0], [27.4, 242.0], [27.5, 242.0], [27.6, 242.0], [27.7, 248.0], [27.8, 248.0], [27.9, 248.0], [28.0, 250.0], [28.1, 250.0], [28.2, 250.0], [28.3, 250.0], [28.4, 253.0], [28.5, 253.0], [28.6, 253.0], [28.7, 255.0], [28.8, 255.0], [28.9, 255.0], [29.0, 296.0], [29.1, 296.0], [29.2, 296.0], [29.3, 296.0], [29.4, 321.0], [29.5, 321.0], [29.6, 321.0], [29.7, 343.0], [29.8, 343.0], [29.9, 343.0], [30.0, 344.0], [30.1, 344.0], [30.2, 344.0], [30.3, 344.0], [30.4, 346.0], [30.5, 346.0], [30.6, 346.0], [30.7, 346.0], [30.8, 346.0], [30.9, 346.0], [31.0, 348.0], [31.1, 348.0], [31.2, 348.0], [31.3, 348.0], [31.4, 354.0], [31.5, 354.0], [31.6, 354.0], [31.7, 355.0], [31.8, 355.0], [31.9, 355.0], [32.0, 356.0], [32.1, 356.0], [32.2, 356.0], [32.3, 356.0], [32.4, 362.0], [32.5, 362.0], [32.6, 362.0], [32.7, 362.0], [32.8, 362.0], [32.9, 362.0], [33.0, 362.0], [33.1, 362.0], [33.2, 362.0], [33.3, 362.0], [33.4, 362.0], [33.5, 362.0], [33.6, 362.0], [33.7, 363.0], [33.8, 363.0], [33.9, 363.0], [34.0, 366.0], [34.1, 366.0], [34.2, 366.0], [34.3, 366.0], [34.4, 366.0], [34.5, 366.0], [34.6, 366.0], [34.7, 367.0], [34.8, 367.0], [34.9, 367.0], [35.0, 367.0], [35.1, 367.0], [35.2, 367.0], [35.3, 367.0], [35.4, 367.0], [35.5, 367.0], [35.6, 367.0], [35.7, 368.0], [35.8, 368.0], [35.9, 368.0], [36.0, 370.0], [36.1, 370.0], [36.2, 370.0], [36.3, 370.0], [36.4, 372.0], [36.5, 372.0], [36.6, 372.0], [36.7, 373.0], [36.8, 373.0], [36.9, 373.0], [37.0, 376.0], [37.1, 376.0], [37.2, 376.0], [37.3, 376.0], [37.4, 377.0], [37.5, 377.0], [37.6, 377.0], [37.7, 415.0], [37.8, 415.0], [37.9, 415.0], [38.0, 445.0], [38.1, 445.0], [38.2, 445.0], [38.3, 445.0], [38.4, 449.0], [38.5, 449.0], [38.6, 449.0], [38.7, 483.0], [38.8, 483.0], [38.9, 483.0], [39.0, 483.0], [39.1, 484.0], [39.2, 484.0], [39.3, 484.0], [39.4, 484.0], [39.5, 484.0], [39.6, 484.0], [39.7, 488.0], [39.8, 488.0], [39.9, 488.0], [40.0, 488.0], [40.1, 492.0], [40.2, 492.0], [40.3, 492.0], [40.4, 497.0], [40.5, 497.0], [40.6, 497.0], [40.7, 506.0], [40.8, 506.0], [40.9, 506.0], [41.0, 506.0], [41.1, 513.0], [41.2, 513.0], [41.3, 513.0], [41.4, 528.0], [41.5, 528.0], [41.6, 528.0], [41.7, 529.0], [41.8, 529.0], [41.9, 529.0], [42.0, 529.0], [42.1, 529.0], [42.2, 529.0], [42.3, 529.0], [42.4, 530.0], [42.5, 530.0], [42.6, 530.0], [42.7, 530.0], [42.8, 530.0], [42.9, 530.0], [43.0, 530.0], [43.1, 530.0], [43.2, 530.0], [43.3, 530.0], [43.4, 531.0], [43.5, 531.0], [43.6, 531.0], [43.7, 533.0], [43.8, 533.0], [43.9, 533.0], [44.0, 533.0], [44.1, 534.0], [44.2, 534.0], [44.3, 534.0], [44.4, 534.0], [44.5, 534.0], [44.6, 534.0], [44.7, 534.0], [44.8, 534.0], [44.9, 534.0], [45.0, 534.0], [45.1, 534.0], [45.2, 534.0], [45.3, 534.0], [45.4, 535.0], [45.5, 535.0], [45.6, 535.0], [45.7, 535.0], [45.8, 535.0], [45.9, 535.0], [46.0, 535.0], [46.1, 535.0], [46.2, 535.0], [46.3, 535.0], [46.4, 535.0], [46.5, 535.0], [46.6, 535.0], [46.7, 536.0], [46.8, 536.0], [46.9, 536.0], [47.0, 536.0], [47.1, 536.0], [47.2, 536.0], [47.3, 536.0], [47.4, 537.0], [47.5, 537.0], [47.6, 537.0], [47.7, 543.0], [47.8, 543.0], [47.9, 543.0], [48.0, 543.0], [48.1, 545.0], [48.2, 545.0], [48.3, 545.0], [48.4, 546.0], [48.5, 546.0], [48.6, 546.0], [48.7, 548.0], [48.8, 548.0], [48.9, 548.0], [49.0, 548.0], [49.1, 554.0], [49.2, 554.0], [49.3, 554.0], [49.4, 558.0], [49.5, 558.0], [49.6, 558.0], [49.7, 560.0], [49.8, 560.0], [49.9, 560.0], [50.0, 560.0], [50.1, 568.0], [50.2, 568.0], [50.3, 568.0], [50.4, 569.0], [50.5, 569.0], [50.6, 569.0], [50.7, 569.0], [50.8, 569.0], [50.9, 569.0], [51.0, 569.0], [51.1, 569.0], [51.2, 569.0], [51.3, 569.0], [51.4, 572.0], [51.5, 572.0], [51.6, 572.0], [51.7, 574.0], [51.8, 574.0], [51.9, 574.0], [52.0, 574.0], [52.1, 576.0], [52.2, 576.0], [52.3, 576.0], [52.4, 577.0], [52.5, 577.0], [52.6, 577.0], [52.7, 580.0], [52.8, 580.0], [52.9, 580.0], [53.0, 580.0], [53.1, 581.0], [53.2, 581.0], [53.3, 581.0], [53.4, 583.0], [53.5, 583.0], [53.6, 583.0], [53.7, 586.0], [53.8, 586.0], [53.9, 586.0], [54.0, 586.0], [54.1, 588.0], [54.2, 588.0], [54.3, 588.0], [54.4, 589.0], [54.5, 589.0], [54.6, 589.0], [54.7, 600.0], [54.8, 600.0], [54.9, 600.0], [55.0, 600.0], [55.1, 601.0], [55.2, 601.0], [55.3, 601.0], [55.4, 602.0], [55.5, 602.0], [55.6, 602.0], [55.7, 604.0], [55.8, 604.0], [55.9, 604.0], [56.0, 604.0], [56.1, 614.0], [56.2, 614.0], [56.3, 614.0], [56.4, 620.0], [56.5, 620.0], [56.6, 620.0], [56.7, 621.0], [56.8, 621.0], [56.9, 621.0], [57.0, 621.0], [57.1, 622.0], [57.2, 622.0], [57.3, 622.0], [57.4, 646.0], [57.5, 646.0], [57.6, 646.0], [57.7, 688.0], [57.8, 688.0], [57.9, 688.0], [58.0, 688.0], [58.1, 698.0], [58.2, 698.0], [58.3, 698.0], [58.4, 699.0], [58.5, 699.0], [58.6, 699.0], [58.7, 701.0], [58.8, 701.0], [58.9, 701.0], [59.0, 701.0], [59.1, 701.0], [59.2, 701.0], [59.3, 701.0], [59.4, 703.0], [59.5, 703.0], [59.6, 703.0], [59.7, 705.0], [59.8, 705.0], [59.9, 705.0], [60.0, 705.0], [60.1, 706.0], [60.2, 706.0], [60.3, 706.0], [60.4, 707.0], [60.5, 707.0], [60.6, 707.0], [60.7, 707.0], [60.8, 707.0], [60.9, 707.0], [61.0, 707.0], [61.1, 712.0], [61.2, 712.0], [61.3, 712.0], [61.4, 714.0], [61.5, 714.0], [61.6, 714.0], [61.7, 721.0], [61.8, 721.0], [61.9, 721.0], [62.0, 721.0], [62.1, 722.0], [62.2, 722.0], [62.3, 722.0], [62.4, 752.0], [62.5, 752.0], [62.6, 752.0], [62.7, 769.0], [62.8, 769.0], [62.9, 769.0], [63.0, 769.0], [63.1, 782.0], [63.2, 782.0], [63.3, 782.0], [63.4, 787.0], [63.5, 787.0], [63.6, 787.0], [63.7, 787.0], [63.8, 787.0], [63.9, 787.0], [64.0, 787.0], [64.1, 845.0], [64.2, 845.0], [64.3, 845.0], [64.4, 849.0], [64.5, 849.0], [64.6, 849.0], [64.7, 861.0], [64.8, 861.0], [64.9, 861.0], [65.0, 861.0], [65.1, 862.0], [65.2, 862.0], [65.3, 862.0], [65.4, 862.0], [65.5, 862.0], [65.6, 862.0], [65.7, 863.0], [65.8, 863.0], [65.9, 863.0], [66.0, 863.0], [66.1, 863.0], [66.2, 863.0], [66.3, 863.0], [66.4, 864.0], [66.5, 864.0], [66.6, 864.0], [66.7, 864.0], [66.8, 864.0], [66.9, 864.0], [67.0, 864.0], [67.1, 865.0], [67.2, 865.0], [67.3, 865.0], [67.4, 865.0], [67.5, 865.0], [67.6, 865.0], [67.7, 865.0], [67.8, 865.0], [67.9, 865.0], [68.0, 865.0], [68.1, 866.0], [68.2, 866.0], [68.3, 866.0], [68.4, 866.0], [68.5, 866.0], [68.6, 866.0], [68.7, 869.0], [68.8, 869.0], [68.9, 869.0], [69.0, 869.0], [69.1, 869.0], [69.2, 869.0], [69.3, 869.0], [69.4, 871.0], [69.5, 871.0], [69.6, 871.0], [69.7, 873.0], [69.8, 873.0], [69.9, 873.0], [70.0, 873.0], [70.1, 873.0], [70.2, 873.0], [70.3, 873.0], [70.4, 874.0], [70.5, 874.0], [70.6, 874.0], [70.7, 875.0], [70.8, 875.0], [70.9, 875.0], [71.0, 875.0], [71.1, 875.0], [71.2, 875.0], [71.3, 875.0], [71.4, 877.0], [71.5, 877.0], [71.6, 877.0], [71.7, 878.0], [71.8, 878.0], [71.9, 878.0], [72.0, 878.0], [72.1, 879.0], [72.2, 879.0], [72.3, 879.0], [72.4, 880.0], [72.5, 880.0], [72.6, 880.0], [72.7, 880.0], [72.8, 880.0], [72.9, 880.0], [73.0, 880.0], [73.1, 881.0], [73.2, 881.0], [73.3, 881.0], [73.4, 881.0], [73.5, 881.0], [73.6, 881.0], [73.7, 881.0], [73.8, 881.0], [73.9, 881.0], [74.0, 881.0], [74.1, 881.0], [74.2, 881.0], [74.3, 881.0], [74.4, 881.0], [74.5, 881.0], [74.6, 881.0], [74.7, 885.0], [74.8, 885.0], [74.9, 885.0], [75.0, 885.0], [75.1, 913.0], [75.2, 913.0], [75.3, 913.0], [75.4, 921.0], [75.5, 921.0], [75.6, 921.0], [75.7, 935.0], [75.8, 935.0], [75.9, 935.0], [76.0, 935.0], [76.1, 937.0], [76.2, 937.0], [76.3, 937.0], [76.4, 942.0], [76.5, 942.0], [76.6, 942.0], [76.7, 1003.0], [76.8, 1003.0], [76.9, 1003.0], [77.0, 1003.0], [77.1, 1010.0], [77.2, 1010.0], [77.3, 1010.0], [77.4, 1021.0], [77.5, 1021.0], [77.6, 1021.0], [77.7, 1025.0], [77.8, 1025.0], [77.9, 1025.0], [78.0, 1025.0], [78.1, 1034.0], [78.2, 1034.0], [78.3, 1034.0], [78.4, 1034.0], [78.5, 1034.0], [78.6, 1034.0], [78.7, 1040.0], [78.8, 1040.0], [78.9, 1040.0], [79.0, 1040.0], [79.1, 1041.0], [79.2, 1041.0], [79.3, 1041.0], [79.4, 1053.0], [79.5, 1053.0], [79.6, 1053.0], [79.7, 1074.0], [79.8, 1074.0], [79.9, 1074.0], [80.0, 1074.0], [80.1, 1082.0], [80.2, 1082.0], [80.3, 1082.0], [80.4, 1086.0], [80.5, 1086.0], [80.6, 1086.0], [80.7, 1114.0], [80.8, 1114.0], [80.9, 1114.0], [81.0, 1114.0], [81.1, 1117.0], [81.2, 1117.0], [81.3, 1117.0], [81.4, 1168.0], [81.5, 1168.0], [81.6, 1168.0], [81.7, 1180.0], [81.8, 1180.0], [81.9, 1180.0], [82.0, 1180.0], [82.1, 1181.0], [82.2, 1181.0], [82.3, 1181.0], [82.4, 1183.0], [82.5, 1183.0], [82.6, 1183.0], [82.7, 1186.0], [82.8, 1186.0], [82.9, 1186.0], [83.0, 1186.0], [83.1, 1203.0], [83.2, 1203.0], [83.3, 1203.0], [83.4, 1206.0], [83.5, 1206.0], [83.6, 1206.0], [83.7, 1208.0], [83.8, 1208.0], [83.9, 1208.0], [84.0, 1209.0], [84.1, 1209.0], [84.2, 1209.0], [84.3, 1209.0], [84.4, 1212.0], [84.5, 1212.0], [84.6, 1212.0], [84.7, 1217.0], [84.8, 1217.0], [84.9, 1217.0], [85.0, 1238.0], [85.1, 1238.0], [85.2, 1238.0], [85.3, 1238.0], [85.4, 1242.0], [85.5, 1242.0], [85.6, 1242.0], [85.7, 1249.0], [85.8, 1249.0], [85.9, 1249.0], [86.0, 1271.0], [86.1, 1271.0], [86.2, 1271.0], [86.3, 1271.0], [86.4, 1277.0], [86.5, 1277.0], [86.6, 1277.0], [86.7, 1373.0], [86.8, 1373.0], [86.9, 1373.0], [87.0, 1377.0], [87.1, 1377.0], [87.2, 1377.0], [87.3, 1377.0], [87.4, 1378.0], [87.5, 1378.0], [87.6, 1378.0], [87.7, 1380.0], [87.8, 1380.0], [87.9, 1380.0], [88.0, 1381.0], [88.1, 1381.0], [88.2, 1381.0], [88.3, 1381.0], [88.4, 1409.0], [88.5, 1409.0], [88.6, 1409.0], [88.7, 1535.0], [88.8, 1535.0], [88.9, 1535.0], [89.0, 1537.0], [89.1, 1537.0], [89.2, 1537.0], [89.3, 1537.0], [89.4, 1540.0], [89.5, 1540.0], [89.6, 1540.0], [89.7, 1541.0], [89.8, 1541.0], [89.9, 1541.0], [90.0, 1542.0], [90.1, 1542.0], [90.2, 1542.0], [90.3, 1542.0], [90.4, 1552.0], [90.5, 1552.0], [90.6, 1552.0], [90.7, 1607.0], [90.8, 1607.0], [90.9, 1607.0], [91.0, 1611.0], [91.1, 1611.0], [91.2, 1611.0], [91.3, 1611.0], [91.4, 1611.0], [91.5, 1611.0], [91.6, 1611.0], [91.7, 1670.0], [91.8, 1670.0], [91.9, 1670.0], [92.0, 1713.0], [92.1, 1713.0], [92.2, 1713.0], [92.3, 1713.0], [92.4, 1881.0], [92.5, 1881.0], [92.6, 1881.0], [92.7, 1882.0], [92.8, 1882.0], [92.9, 1882.0], [93.0, 1883.0], [93.1, 1883.0], [93.2, 1883.0], [93.3, 1883.0], [93.4, 1883.0], [93.5, 1883.0], [93.6, 1883.0], [93.7, 1887.0], [93.8, 1887.0], [93.9, 1887.0], [94.0, 1925.0], [94.1, 1925.0], [94.2, 1925.0], [94.3, 1925.0], [94.4, 1955.0], [94.5, 1955.0], [94.6, 1955.0], [94.7, 2020.0], [94.8, 2020.0], [94.9, 2020.0], [95.0, 2026.0], [95.1, 2026.0], [95.2, 2026.0], [95.3, 2026.0], [95.4, 2041.0], [95.5, 2041.0], [95.6, 2041.0], [95.7, 2048.0], [95.8, 2048.0], [95.9, 2048.0], [96.0, 2050.0], [96.1, 2050.0], [96.2, 2050.0], [96.3, 2050.0], [96.4, 2157.0], [96.5, 2157.0], [96.6, 2157.0], [96.7, 2175.0], [96.8, 2175.0], [96.9, 2175.0], [97.0, 2217.0], [97.1, 2217.0], [97.2, 2217.0], [97.3, 2217.0], [97.4, 2220.0], [97.5, 2220.0], [97.6, 2220.0], [97.7, 2249.0], [97.8, 2249.0], [97.9, 2249.0], [98.0, 2453.0], [98.1, 2453.0], [98.2, 2453.0], [98.3, 2453.0], [98.4, 2720.0], [98.5, 2720.0], [98.6, 2720.0], [98.7, 2885.0], [98.8, 2885.0], [98.9, 2885.0], [99.0, 2887.0], [99.1, 2887.0], [99.2, 2887.0], [99.3, 2887.0], [99.4, 3050.0], [99.5, 3050.0], [99.6, 3050.0], [99.7, 3179.0], [99.8, 3179.0], [99.9, 3179.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 100.0, "maxY": 50.0, "series": [{"data": [[600.0, 12.0], [700.0, 16.0], [800.0, 33.0], [900.0, 5.0], [1000.0, 12.0], [1100.0, 7.0], [1200.0, 11.0], [1300.0, 5.0], [1400.0, 1.0], [1500.0, 6.0], [1600.0, 4.0], [100.0, 38.0], [1700.0, 1.0], [1800.0, 5.0], [1900.0, 2.0], [2000.0, 5.0], [2100.0, 2.0], [2200.0, 3.0], [2400.0, 1.0], [2800.0, 2.0], [2700.0, 1.0], [3000.0, 1.0], [3100.0, 1.0], [200.0, 50.0], [300.0, 25.0], [400.0, 9.0], [500.0, 42.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 3100.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 34.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 144.0, "series": [{"data": [[0.0, 122.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 144.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 34.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 26.365384615384606, "minX": 1.75107966E12, "maxY": 26.852040816326532, "series": [{"data": [[1.75107966E12, 26.365384615384606], [1.75107972E12, 26.852040816326532]], "isOverall": false, "label": "Auth Test Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107972E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 358.5, "minX": 1.0, "maxY": 1217.0, "series": [{"data": [[2.0, 1117.0], [3.0, 673.0], [4.0, 602.0], [5.0, 541.5], [6.0, 471.5], [7.0, 432.0], [8.0, 453.0], [9.0, 385.5], [10.0, 383.0], [11.0, 434.0], [12.0, 443.0], [13.0, 456.0], [14.0, 458.0], [15.0, 625.5], [16.0, 546.0], [1.0, 1217.0], [17.0, 877.0], [18.0, 751.5], [19.0, 934.25], [20.0, 1071.3333333333333], [21.0, 792.0], [22.0, 631.0], [23.0, 495.25], [24.0, 358.5], [25.0, 576.0], [26.0, 764.0], [27.0, 953.5], [28.0, 437.33333333333326], [29.0, 458.2857142857142], [30.0, 786.8217821782175]], "isOverall": false, "label": "Login Request", "isController": false}, {"data": [[26.68333333333334, 727.6033333333339]], "isOverall": false, "label": "Login Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 30.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 393.46666666666664, "minX": 1.75107966E12, "maxY": 1757.4666666666667, "series": [{"data": [[1.75107966E12, 932.5333333333333], [1.75107972E12, 1757.4666666666667]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.75107966E12, 393.46666666666664], [1.75107972E12, 741.5333333333333]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107972E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 475.79081632653043, "minX": 1.75107966E12, "maxY": 1202.1730769230767, "series": [{"data": [[1.75107966E12, 1202.1730769230767], [1.75107972E12, 475.79081632653043]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107972E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 475.7602040816324, "minX": 1.75107966E12, "maxY": 1202.115384615384, "series": [{"data": [[1.75107966E12, 1202.115384615384], [1.75107972E12, 475.7602040816324]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107972E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.0, "minX": 1.75107966E12, "maxY": 0.3076923076923077, "series": [{"data": [[1.75107966E12, 0.3076923076923077], [1.75107972E12, 0.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107972E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 168.0, "minX": 1.75107966E12, "maxY": 3179.0, "series": [{"data": [[1.75107966E12, 3179.0], [1.75107972E12, 1217.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.75107966E12, 172.0], [1.75107972E12, 168.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.75107966E12, 2166.0], [1.75107972E12, 880.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.75107966E12, 3172.55], [1.75107972E12, 1186.93]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.75107966E12, 1094.0], [1.75107972E12, 413.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.75107966E12, 2653.25], [1.75107972E12, 1027.2499999999995]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107972E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 186.0, "minX": 3.0, "maxY": 862.5, "series": [{"data": [[4.0, 186.0], [5.0, 208.5], [6.0, 862.5], [3.0, 211.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 186.0, "minX": 3.0, "maxY": 862.5, "series": [{"data": [[4.0, 186.0], [5.0, 208.5], [6.0, 862.5], [3.0, 211.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 1.7833333333333334, "minX": 1.75107966E12, "maxY": 3.216666666666667, "series": [{"data": [[1.75107966E12, 1.7833333333333334], [1.75107972E12, 3.216666666666667]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107972E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 1.7333333333333334, "minX": 1.75107966E12, "maxY": 3.2666666666666666, "series": [{"data": [[1.75107966E12, 1.7333333333333334], [1.75107972E12, 3.2666666666666666]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.75107972E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 1.7333333333333334, "minX": 1.75107966E12, "maxY": 3.2666666666666666, "series": [{"data": [[1.75107966E12, 1.7333333333333334], [1.75107972E12, 3.2666666666666666]], "isOverall": false, "label": "Login Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107972E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 1.7333333333333334, "minX": 1.75107966E12, "maxY": 3.2666666666666666, "series": [{"data": [[1.75107966E12, 1.7333333333333334], [1.75107972E12, 3.2666666666666666]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.75107972E12, "title": "Total Transactions Per Second"}},
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

