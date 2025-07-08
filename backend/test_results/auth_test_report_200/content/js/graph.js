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
        data: {"result": {"minY": 199.0, "minX": 0.0, "maxY": 3845.0, "series": [{"data": [[0.0, 199.0], [0.1, 199.0], [0.2, 199.0], [0.3, 199.0], [0.4, 199.0], [0.5, 209.0], [0.6, 209.0], [0.7, 209.0], [0.8, 209.0], [0.9, 209.0], [1.0, 213.0], [1.1, 213.0], [1.2, 213.0], [1.3, 213.0], [1.4, 213.0], [1.5, 223.0], [1.6, 223.0], [1.7, 223.0], [1.8, 223.0], [1.9, 223.0], [2.0, 259.0], [2.1, 259.0], [2.2, 259.0], [2.3, 259.0], [2.4, 259.0], [2.5, 334.0], [2.6, 334.0], [2.7, 334.0], [2.8, 334.0], [2.9, 334.0], [3.0, 339.0], [3.1, 339.0], [3.2, 339.0], [3.3, 339.0], [3.4, 339.0], [3.5, 351.0], [3.6, 351.0], [3.7, 351.0], [3.8, 351.0], [3.9, 351.0], [4.0, 370.0], [4.1, 370.0], [4.2, 370.0], [4.3, 370.0], [4.4, 370.0], [4.5, 389.0], [4.6, 389.0], [4.7, 389.0], [4.8, 389.0], [4.9, 389.0], [5.0, 496.0], [5.1, 496.0], [5.2, 496.0], [5.3, 496.0], [5.4, 496.0], [5.5, 497.0], [5.6, 497.0], [5.7, 497.0], [5.8, 497.0], [5.9, 497.0], [6.0, 497.0], [6.1, 497.0], [6.2, 497.0], [6.3, 497.0], [6.4, 497.0], [6.5, 498.0], [6.6, 498.0], [6.7, 498.0], [6.8, 498.0], [6.9, 498.0], [7.0, 499.0], [7.1, 499.0], [7.2, 499.0], [7.3, 499.0], [7.4, 499.0], [7.5, 501.0], [7.6, 501.0], [7.7, 501.0], [7.8, 501.0], [7.9, 501.0], [8.0, 537.0], [8.1, 537.0], [8.2, 537.0], [8.3, 537.0], [8.4, 537.0], [8.5, 661.0], [8.6, 661.0], [8.7, 661.0], [8.8, 661.0], [8.9, 661.0], [9.0, 662.0], [9.1, 662.0], [9.2, 662.0], [9.3, 662.0], [9.4, 662.0], [9.5, 662.0], [9.6, 662.0], [9.7, 662.0], [9.8, 662.0], [9.9, 662.0], [10.0, 662.0], [10.1, 662.0], [10.2, 662.0], [10.3, 662.0], [10.4, 662.0], [10.5, 663.0], [10.6, 663.0], [10.7, 663.0], [10.8, 663.0], [10.9, 663.0], [11.0, 691.0], [11.1, 691.0], [11.2, 691.0], [11.3, 691.0], [11.4, 691.0], [11.5, 776.0], [11.6, 776.0], [11.7, 776.0], [11.8, 776.0], [11.9, 776.0], [12.0, 827.0], [12.1, 827.0], [12.2, 827.0], [12.3, 827.0], [12.4, 827.0], [12.5, 828.0], [12.6, 828.0], [12.7, 828.0], [12.8, 828.0], [12.9, 828.0], [13.0, 828.0], [13.1, 828.0], [13.2, 828.0], [13.3, 828.0], [13.4, 828.0], [13.5, 828.0], [13.6, 828.0], [13.7, 828.0], [13.8, 828.0], [13.9, 828.0], [14.0, 828.0], [14.1, 828.0], [14.2, 828.0], [14.3, 828.0], [14.4, 828.0], [14.5, 839.0], [14.6, 839.0], [14.7, 839.0], [14.8, 839.0], [14.9, 839.0], [15.0, 841.0], [15.1, 841.0], [15.2, 841.0], [15.3, 841.0], [15.4, 841.0], [15.5, 842.0], [15.6, 842.0], [15.7, 842.0], [15.8, 842.0], [15.9, 842.0], [16.0, 848.0], [16.1, 848.0], [16.2, 848.0], [16.3, 848.0], [16.4, 848.0], [16.5, 868.0], [16.6, 868.0], [16.7, 868.0], [16.8, 868.0], [16.9, 868.0], [17.0, 870.0], [17.1, 870.0], [17.2, 870.0], [17.3, 870.0], [17.4, 870.0], [17.5, 996.0], [17.6, 996.0], [17.7, 996.0], [17.8, 996.0], [17.9, 996.0], [18.0, 998.0], [18.1, 998.0], [18.2, 998.0], [18.3, 998.0], [18.4, 998.0], [18.5, 998.0], [18.6, 998.0], [18.7, 998.0], [18.8, 998.0], [18.9, 998.0], [19.0, 1000.0], [19.1, 1000.0], [19.2, 1000.0], [19.3, 1000.0], [19.4, 1000.0], [19.5, 1003.0], [19.6, 1003.0], [19.7, 1003.0], [19.8, 1003.0], [19.9, 1003.0], [20.0, 1004.0], [20.1, 1004.0], [20.2, 1004.0], [20.3, 1004.0], [20.4, 1004.0], [20.5, 1007.0], [20.6, 1007.0], [20.7, 1007.0], [20.8, 1007.0], [20.9, 1007.0], [21.0, 1041.0], [21.1, 1041.0], [21.2, 1041.0], [21.3, 1041.0], [21.4, 1041.0], [21.5, 1046.0], [21.6, 1046.0], [21.7, 1046.0], [21.8, 1046.0], [21.9, 1046.0], [22.0, 1159.0], [22.1, 1159.0], [22.2, 1159.0], [22.3, 1159.0], [22.4, 1159.0], [22.5, 1160.0], [22.6, 1160.0], [22.7, 1160.0], [22.8, 1160.0], [22.9, 1160.0], [23.0, 1163.0], [23.1, 1163.0], [23.2, 1163.0], [23.3, 1163.0], [23.4, 1163.0], [23.5, 1168.0], [23.6, 1168.0], [23.7, 1168.0], [23.8, 1168.0], [23.9, 1168.0], [24.0, 1169.0], [24.1, 1169.0], [24.2, 1169.0], [24.3, 1169.0], [24.4, 1169.0], [24.5, 1171.0], [24.6, 1171.0], [24.7, 1171.0], [24.8, 1171.0], [24.9, 1171.0], [25.0, 1183.0], [25.1, 1183.0], [25.2, 1183.0], [25.3, 1183.0], [25.4, 1183.0], [25.5, 1270.0], [25.6, 1270.0], [25.7, 1270.0], [25.8, 1270.0], [25.9, 1270.0], [26.0, 1327.0], [26.1, 1327.0], [26.2, 1327.0], [26.3, 1327.0], [26.4, 1327.0], [26.5, 1329.0], [26.6, 1329.0], [26.7, 1329.0], [26.8, 1329.0], [26.9, 1329.0], [27.0, 1334.0], [27.1, 1334.0], [27.2, 1334.0], [27.3, 1334.0], [27.4, 1334.0], [27.5, 1339.0], [27.6, 1339.0], [27.7, 1339.0], [27.8, 1339.0], [27.9, 1339.0], [28.0, 1340.0], [28.1, 1340.0], [28.2, 1340.0], [28.3, 1340.0], [28.4, 1340.0], [28.5, 1340.0], [28.6, 1340.0], [28.7, 1340.0], [28.8, 1340.0], [28.9, 1340.0], [29.0, 1341.0], [29.1, 1341.0], [29.2, 1341.0], [29.3, 1341.0], [29.4, 1341.0], [29.5, 1342.0], [29.6, 1342.0], [29.7, 1342.0], [29.8, 1342.0], [29.9, 1342.0], [30.0, 1345.0], [30.1, 1345.0], [30.2, 1345.0], [30.3, 1345.0], [30.4, 1345.0], [30.5, 1431.0], [30.6, 1431.0], [30.7, 1431.0], [30.8, 1431.0], [30.9, 1431.0], [31.0, 1494.0], [31.1, 1494.0], [31.2, 1494.0], [31.3, 1494.0], [31.4, 1494.0], [31.5, 1494.0], [31.6, 1494.0], [31.7, 1494.0], [31.8, 1494.0], [31.9, 1494.0], [32.0, 1495.0], [32.1, 1495.0], [32.2, 1495.0], [32.3, 1495.0], [32.4, 1495.0], [32.5, 1495.0], [32.6, 1495.0], [32.7, 1495.0], [32.8, 1495.0], [32.9, 1495.0], [33.0, 1496.0], [33.1, 1496.0], [33.2, 1496.0], [33.3, 1496.0], [33.4, 1496.0], [33.5, 1496.0], [33.6, 1496.0], [33.7, 1496.0], [33.8, 1496.0], [33.9, 1496.0], [34.0, 1497.0], [34.1, 1497.0], [34.2, 1497.0], [34.3, 1497.0], [34.4, 1497.0], [34.5, 1498.0], [34.6, 1498.0], [34.7, 1498.0], [34.8, 1498.0], [34.9, 1498.0], [35.0, 1498.0], [35.1, 1498.0], [35.2, 1498.0], [35.3, 1498.0], [35.4, 1498.0], [35.5, 1499.0], [35.6, 1499.0], [35.7, 1499.0], [35.8, 1499.0], [35.9, 1499.0], [36.0, 1534.0], [36.1, 1534.0], [36.2, 1534.0], [36.3, 1534.0], [36.4, 1534.0], [36.5, 1540.0], [36.6, 1540.0], [36.7, 1540.0], [36.8, 1540.0], [36.9, 1540.0], [37.0, 1550.0], [37.1, 1550.0], [37.2, 1550.0], [37.3, 1550.0], [37.4, 1550.0], [37.5, 1603.0], [37.6, 1603.0], [37.7, 1603.0], [37.8, 1603.0], [37.9, 1603.0], [38.0, 1618.0], [38.1, 1618.0], [38.2, 1618.0], [38.3, 1618.0], [38.4, 1618.0], [38.5, 1661.0], [38.6, 1661.0], [38.7, 1661.0], [38.8, 1661.0], [38.9, 1661.0], [39.0, 1662.0], [39.1, 1662.0], [39.2, 1662.0], [39.3, 1662.0], [39.4, 1662.0], [39.5, 1664.0], [39.6, 1664.0], [39.7, 1664.0], [39.8, 1664.0], [39.9, 1664.0], [40.0, 1678.0], [40.1, 1678.0], [40.2, 1678.0], [40.3, 1678.0], [40.4, 1678.0], [40.5, 1678.0], [40.6, 1678.0], [40.7, 1678.0], [40.8, 1678.0], [40.9, 1678.0], [41.0, 1680.0], [41.1, 1680.0], [41.2, 1680.0], [41.3, 1680.0], [41.4, 1680.0], [41.5, 1680.0], [41.6, 1680.0], [41.7, 1680.0], [41.8, 1680.0], [41.9, 1680.0], [42.0, 1680.0], [42.1, 1680.0], [42.2, 1680.0], [42.3, 1680.0], [42.4, 1680.0], [42.5, 1682.0], [42.6, 1682.0], [42.7, 1682.0], [42.8, 1682.0], [42.9, 1682.0], [43.0, 1691.0], [43.1, 1691.0], [43.2, 1691.0], [43.3, 1691.0], [43.4, 1691.0], [43.5, 1721.0], [43.6, 1721.0], [43.7, 1721.0], [43.8, 1721.0], [43.9, 1721.0], [44.0, 1826.0], [44.1, 1826.0], [44.2, 1826.0], [44.3, 1826.0], [44.4, 1826.0], [44.5, 1827.0], [44.6, 1827.0], [44.7, 1827.0], [44.8, 1827.0], [44.9, 1827.0], [45.0, 1827.0], [45.1, 1827.0], [45.2, 1827.0], [45.3, 1827.0], [45.4, 1827.0], [45.5, 1827.0], [45.6, 1827.0], [45.7, 1827.0], [45.8, 1827.0], [45.9, 1827.0], [46.0, 1827.0], [46.1, 1827.0], [46.2, 1827.0], [46.3, 1827.0], [46.4, 1827.0], [46.5, 1834.0], [46.6, 1834.0], [46.7, 1834.0], [46.8, 1834.0], [46.9, 1834.0], [47.0, 1845.0], [47.1, 1845.0], [47.2, 1845.0], [47.3, 1845.0], [47.4, 1845.0], [47.5, 1868.0], [47.6, 1868.0], [47.7, 1868.0], [47.8, 1868.0], [47.9, 1868.0], [48.0, 1989.0], [48.1, 1989.0], [48.2, 1989.0], [48.3, 1989.0], [48.4, 1989.0], [48.5, 1990.0], [48.6, 1990.0], [48.7, 1990.0], [48.8, 1990.0], [48.9, 1990.0], [49.0, 1992.0], [49.1, 1992.0], [49.2, 1992.0], [49.3, 1992.0], [49.4, 1992.0], [49.5, 1992.0], [49.6, 1992.0], [49.7, 1992.0], [49.8, 1992.0], [49.9, 1992.0], [50.0, 1992.0], [50.1, 1992.0], [50.2, 1992.0], [50.3, 1992.0], [50.4, 1992.0], [50.5, 1992.0], [50.6, 1992.0], [50.7, 1992.0], [50.8, 1992.0], [50.9, 1992.0], [51.0, 1992.0], [51.1, 1992.0], [51.2, 1992.0], [51.3, 1992.0], [51.4, 1992.0], [51.5, 1993.0], [51.6, 1993.0], [51.7, 1993.0], [51.8, 1993.0], [51.9, 1993.0], [52.0, 1994.0], [52.1, 1994.0], [52.2, 1994.0], [52.3, 1994.0], [52.4, 1994.0], [52.5, 1994.0], [52.6, 1994.0], [52.7, 1994.0], [52.8, 1994.0], [52.9, 1994.0], [53.0, 1996.0], [53.1, 1996.0], [53.2, 1996.0], [53.3, 1996.0], [53.4, 1996.0], [53.5, 2017.0], [53.6, 2017.0], [53.7, 2017.0], [53.8, 2017.0], [53.9, 2017.0], [54.0, 2036.0], [54.1, 2036.0], [54.2, 2036.0], [54.3, 2036.0], [54.4, 2036.0], [54.5, 2158.0], [54.6, 2158.0], [54.7, 2158.0], [54.8, 2158.0], [54.9, 2158.0], [55.0, 2160.0], [55.1, 2160.0], [55.2, 2160.0], [55.3, 2160.0], [55.4, 2160.0], [55.5, 2160.0], [55.6, 2160.0], [55.7, 2160.0], [55.8, 2160.0], [55.9, 2160.0], [56.0, 2160.0], [56.1, 2160.0], [56.2, 2160.0], [56.3, 2160.0], [56.4, 2160.0], [56.5, 2160.0], [56.6, 2160.0], [56.7, 2160.0], [56.8, 2160.0], [56.9, 2160.0], [57.0, 2160.0], [57.1, 2160.0], [57.2, 2160.0], [57.3, 2160.0], [57.4, 2160.0], [57.5, 2161.0], [57.6, 2161.0], [57.7, 2161.0], [57.8, 2161.0], [57.9, 2161.0], [58.0, 2161.0], [58.1, 2161.0], [58.2, 2161.0], [58.3, 2161.0], [58.4, 2161.0], [58.5, 2162.0], [58.6, 2162.0], [58.7, 2162.0], [58.8, 2162.0], [58.9, 2162.0], [59.0, 2162.0], [59.1, 2162.0], [59.2, 2162.0], [59.3, 2162.0], [59.4, 2162.0], [59.5, 2163.0], [59.6, 2163.0], [59.7, 2163.0], [59.8, 2163.0], [59.9, 2163.0], [60.0, 2163.0], [60.1, 2163.0], [60.2, 2163.0], [60.3, 2163.0], [60.4, 2163.0], [60.5, 2163.0], [60.6, 2163.0], [60.7, 2163.0], [60.8, 2163.0], [60.9, 2163.0], [61.0, 2163.0], [61.1, 2163.0], [61.2, 2163.0], [61.3, 2163.0], [61.4, 2163.0], [61.5, 2163.0], [61.6, 2163.0], [61.7, 2163.0], [61.8, 2163.0], [61.9, 2163.0], [62.0, 2164.0], [62.1, 2164.0], [62.2, 2164.0], [62.3, 2164.0], [62.4, 2164.0], [62.5, 2164.0], [62.6, 2164.0], [62.7, 2164.0], [62.8, 2164.0], [62.9, 2164.0], [63.0, 2164.0], [63.1, 2164.0], [63.2, 2164.0], [63.3, 2164.0], [63.4, 2164.0], [63.5, 2164.0], [63.6, 2164.0], [63.7, 2164.0], [63.8, 2164.0], [63.9, 2164.0], [64.0, 2165.0], [64.1, 2165.0], [64.2, 2165.0], [64.3, 2165.0], [64.4, 2165.0], [64.5, 2165.0], [64.6, 2165.0], [64.7, 2165.0], [64.8, 2165.0], [64.9, 2165.0], [65.0, 2165.0], [65.1, 2165.0], [65.2, 2165.0], [65.3, 2165.0], [65.4, 2165.0], [65.5, 2165.0], [65.6, 2165.0], [65.7, 2165.0], [65.8, 2165.0], [65.9, 2165.0], [66.0, 2166.0], [66.1, 2166.0], [66.2, 2166.0], [66.3, 2166.0], [66.4, 2166.0], [66.5, 2167.0], [66.6, 2167.0], [66.7, 2167.0], [66.8, 2167.0], [66.9, 2167.0], [67.0, 2169.0], [67.1, 2169.0], [67.2, 2169.0], [67.3, 2169.0], [67.4, 2169.0], [67.5, 2171.0], [67.6, 2171.0], [67.7, 2171.0], [67.8, 2171.0], [67.9, 2171.0], [68.0, 2173.0], [68.1, 2173.0], [68.2, 2173.0], [68.3, 2173.0], [68.4, 2173.0], [68.5, 2184.0], [68.6, 2184.0], [68.7, 2184.0], [68.8, 2184.0], [68.9, 2184.0], [69.0, 2192.0], [69.1, 2192.0], [69.2, 2192.0], [69.3, 2192.0], [69.4, 2192.0], [69.5, 2202.0], [69.6, 2202.0], [69.7, 2202.0], [69.8, 2202.0], [69.9, 2202.0], [70.0, 2205.0], [70.1, 2205.0], [70.2, 2205.0], [70.3, 2205.0], [70.4, 2205.0], [70.5, 2351.0], [70.6, 2351.0], [70.7, 2351.0], [70.8, 2351.0], [70.9, 2351.0], [71.0, 2351.0], [71.1, 2351.0], [71.2, 2351.0], [71.3, 2351.0], [71.4, 2351.0], [71.5, 2436.0], [71.6, 2436.0], [71.7, 2436.0], [71.8, 2436.0], [71.9, 2436.0], [72.0, 2492.0], [72.1, 2492.0], [72.2, 2492.0], [72.3, 2492.0], [72.4, 2492.0], [72.5, 2492.0], [72.6, 2492.0], [72.7, 2492.0], [72.8, 2492.0], [72.9, 2492.0], [73.0, 2492.0], [73.1, 2492.0], [73.2, 2492.0], [73.3, 2492.0], [73.4, 2492.0], [73.5, 2493.0], [73.6, 2493.0], [73.7, 2493.0], [73.8, 2493.0], [73.9, 2493.0], [74.0, 2493.0], [74.1, 2493.0], [74.2, 2493.0], [74.3, 2493.0], [74.4, 2493.0], [74.5, 2493.0], [74.6, 2493.0], [74.7, 2493.0], [74.8, 2493.0], [74.9, 2493.0], [75.0, 2493.0], [75.1, 2493.0], [75.2, 2493.0], [75.3, 2493.0], [75.4, 2493.0], [75.5, 2493.0], [75.6, 2493.0], [75.7, 2493.0], [75.8, 2493.0], [75.9, 2493.0], [76.0, 2493.0], [76.1, 2493.0], [76.2, 2493.0], [76.3, 2493.0], [76.4, 2493.0], [76.5, 2494.0], [76.6, 2494.0], [76.7, 2494.0], [76.8, 2494.0], [76.9, 2494.0], [77.0, 2494.0], [77.1, 2494.0], [77.2, 2494.0], [77.3, 2494.0], [77.4, 2494.0], [77.5, 2494.0], [77.6, 2494.0], [77.7, 2494.0], [77.8, 2494.0], [77.9, 2494.0], [78.0, 2494.0], [78.1, 2494.0], [78.2, 2494.0], [78.3, 2494.0], [78.4, 2494.0], [78.5, 2494.0], [78.6, 2494.0], [78.7, 2494.0], [78.8, 2494.0], [78.9, 2494.0], [79.0, 2495.0], [79.1, 2495.0], [79.2, 2495.0], [79.3, 2495.0], [79.4, 2495.0], [79.5, 2495.0], [79.6, 2495.0], [79.7, 2495.0], [79.8, 2495.0], [79.9, 2495.0], [80.0, 2495.0], [80.1, 2495.0], [80.2, 2495.0], [80.3, 2495.0], [80.4, 2495.0], [80.5, 2495.0], [80.6, 2495.0], [80.7, 2495.0], [80.8, 2495.0], [80.9, 2495.0], [81.0, 2495.0], [81.1, 2495.0], [81.2, 2495.0], [81.3, 2495.0], [81.4, 2495.0], [81.5, 2496.0], [81.6, 2496.0], [81.7, 2496.0], [81.8, 2496.0], [81.9, 2496.0], [82.0, 2496.0], [82.1, 2496.0], [82.2, 2496.0], [82.3, 2496.0], [82.4, 2496.0], [82.5, 2497.0], [82.6, 2497.0], [82.7, 2497.0], [82.8, 2497.0], [82.9, 2497.0], [83.0, 2498.0], [83.1, 2498.0], [83.2, 2498.0], [83.3, 2498.0], [83.4, 2498.0], [83.5, 2498.0], [83.6, 2498.0], [83.7, 2498.0], [83.8, 2498.0], [83.9, 2498.0], [84.0, 2504.0], [84.1, 2504.0], [84.2, 2504.0], [84.3, 2504.0], [84.4, 2504.0], [84.5, 2507.0], [84.6, 2507.0], [84.7, 2507.0], [84.8, 2507.0], [84.9, 2507.0], [85.0, 2509.0], [85.1, 2509.0], [85.2, 2509.0], [85.3, 2509.0], [85.4, 2509.0], [85.5, 2512.0], [85.6, 2512.0], [85.7, 2512.0], [85.8, 2512.0], [85.9, 2512.0], [86.0, 2512.0], [86.1, 2512.0], [86.2, 2512.0], [86.3, 2512.0], [86.4, 2512.0], [86.5, 2513.0], [86.6, 2513.0], [86.7, 2513.0], [86.8, 2513.0], [86.9, 2513.0], [87.0, 2515.0], [87.1, 2515.0], [87.2, 2515.0], [87.3, 2515.0], [87.4, 2515.0], [87.5, 2515.0], [87.6, 2515.0], [87.7, 2515.0], [87.8, 2515.0], [87.9, 2515.0], [88.0, 2516.0], [88.1, 2516.0], [88.2, 2516.0], [88.3, 2516.0], [88.4, 2516.0], [88.5, 2516.0], [88.6, 2516.0], [88.7, 2516.0], [88.8, 2516.0], [88.9, 2516.0], [89.0, 2535.0], [89.1, 2535.0], [89.2, 2535.0], [89.3, 2535.0], [89.4, 2535.0], [89.5, 2535.0], [89.6, 2535.0], [89.7, 2535.0], [89.8, 2535.0], [89.9, 2535.0], [90.0, 2599.0], [90.1, 2599.0], [90.2, 2599.0], [90.3, 2599.0], [90.4, 2599.0], [90.5, 2656.0], [90.6, 2656.0], [90.7, 2656.0], [90.8, 2656.0], [90.9, 2656.0], [91.0, 2656.0], [91.1, 2656.0], [91.2, 2656.0], [91.3, 2656.0], [91.4, 2656.0], [91.5, 2656.0], [91.6, 2656.0], [91.7, 2656.0], [91.8, 2656.0], [91.9, 2656.0], [92.0, 2657.0], [92.1, 2657.0], [92.2, 2657.0], [92.3, 2657.0], [92.4, 2657.0], [92.5, 2657.0], [92.6, 2657.0], [92.7, 2657.0], [92.8, 2657.0], [92.9, 2657.0], [93.0, 2657.0], [93.1, 2657.0], [93.2, 2657.0], [93.3, 2657.0], [93.4, 2657.0], [93.5, 2658.0], [93.6, 2658.0], [93.7, 2658.0], [93.8, 2658.0], [93.9, 2658.0], [94.0, 2659.0], [94.1, 2659.0], [94.2, 2659.0], [94.3, 2659.0], [94.4, 2659.0], [94.5, 2659.0], [94.6, 2659.0], [94.7, 2659.0], [94.8, 2659.0], [94.9, 2659.0], [95.0, 2659.0], [95.1, 2659.0], [95.2, 2659.0], [95.3, 2659.0], [95.4, 2659.0], [95.5, 2660.0], [95.6, 2660.0], [95.7, 2660.0], [95.8, 2660.0], [95.9, 2660.0], [96.0, 2660.0], [96.1, 2660.0], [96.2, 2660.0], [96.3, 2660.0], [96.4, 2660.0], [96.5, 2698.0], [96.6, 2698.0], [96.7, 2698.0], [96.8, 2698.0], [96.9, 2698.0], [97.0, 2699.0], [97.1, 2699.0], [97.2, 2699.0], [97.3, 2699.0], [97.4, 2699.0], [97.5, 2865.0], [97.6, 2865.0], [97.7, 2865.0], [97.8, 2865.0], [97.9, 2865.0], [98.0, 3107.0], [98.1, 3107.0], [98.2, 3107.0], [98.3, 3107.0], [98.4, 3107.0], [98.5, 3188.0], [98.6, 3188.0], [98.7, 3188.0], [98.8, 3188.0], [98.9, 3188.0], [99.0, 3758.0], [99.1, 3758.0], [99.2, 3758.0], [99.3, 3758.0], [99.4, 3758.0], [99.5, 3845.0], [99.6, 3845.0], [99.7, 3845.0], [99.8, 3845.0], [99.9, 3845.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 100.0, "maxY": 30.0, "series": [{"data": [[600.0, 6.0], [700.0, 1.0], [800.0, 11.0], [900.0, 3.0], [1000.0, 6.0], [1100.0, 7.0], [1200.0, 1.0], [1300.0, 9.0], [1400.0, 11.0], [1500.0, 3.0], [100.0, 1.0], [1600.0, 12.0], [1700.0, 1.0], [1800.0, 8.0], [1900.0, 11.0], [2000.0, 2.0], [2100.0, 30.0], [2200.0, 2.0], [2300.0, 2.0], [2400.0, 25.0], [2500.0, 13.0], [2600.0, 14.0], [2800.0, 1.0], [3100.0, 2.0], [200.0, 4.0], [3700.0, 1.0], [3800.0, 1.0], [300.0, 5.0], [400.0, 5.0], [500.0, 2.0]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 3800.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 15.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 128.0, "series": [{"data": [[0.0, 15.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 57.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 128.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 10.764999999999999, "minX": 1.751079E12, "maxY": 10.764999999999999, "series": [{"data": [[1.751079E12, 10.764999999999999]], "isOverall": false, "label": "Auth Test Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.751079E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 283.0, "minX": 1.0, "maxY": 2595.3666666666672, "series": [{"data": [[2.0, 370.8], [8.0, 1290.7142857142858], [9.0, 1665.1333333333332], [10.0, 1730.75], [11.0, 1623.0], [3.0, 534.2857142857143], [12.0, 1948.9444444444446], [13.0, 2268.6071428571427], [14.0, 2060.125], [15.0, 2595.3666666666672], [1.0, 283.0], [4.0, 646.1666666666666], [16.0, 2494.235294117647], [17.0, 2397.75], [5.0, 937.3636363636364], [6.0, 981.6666666666665], [7.0, 1112.1666666666665]], "isOverall": false, "label": "Login Request", "isController": false}, {"data": [[10.764999999999999, 1787.9049999999997]], "isOverall": false, "label": "Login Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 17.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 756.6666666666666, "minX": 1.751079E12, "maxY": 1793.3333333333333, "series": [{"data": [[1.751079E12, 1793.3333333333333]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.751079E12, 756.6666666666666]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.751079E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 1787.9049999999997, "minX": 1.751079E12, "maxY": 1787.9049999999997, "series": [{"data": [[1.751079E12, 1787.9049999999997]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.751079E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 1787.885, "minX": 1.751079E12, "maxY": 1787.885, "series": [{"data": [[1.751079E12, 1787.885]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.751079E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.1200000000000001, "minX": 1.751079E12, "maxY": 0.1200000000000001, "series": [{"data": [[1.751079E12, 0.1200000000000001]], "isOverall": false, "label": "Login Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.751079E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 199.0, "minX": 1.751079E12, "maxY": 3845.0, "series": [{"data": [[1.751079E12, 3845.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.751079E12, 199.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.751079E12, 2592.6000000000004]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.751079E12, 3752.300000000005]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.751079E12, 1992.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.751079E12, 2659.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.751079E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 213.0, "minX": 3.0, "maxY": 1993.5, "series": [{"data": [[5.0, 839.0], [3.0, 213.0], [6.0, 1993.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 213.0, "minX": 3.0, "maxY": 1993.5, "series": [{"data": [[5.0, 839.0], [3.0, 213.0], [6.0, 1993.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 6.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 3.3333333333333335, "minX": 1.751079E12, "maxY": 3.3333333333333335, "series": [{"data": [[1.751079E12, 3.3333333333333335]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.751079E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 3.3333333333333335, "minX": 1.751079E12, "maxY": 3.3333333333333335, "series": [{"data": [[1.751079E12, 3.3333333333333335]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.751079E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 3.3333333333333335, "minX": 1.751079E12, "maxY": 3.3333333333333335, "series": [{"data": [[1.751079E12, 3.3333333333333335]], "isOverall": false, "label": "Login Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.751079E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 3.3333333333333335, "minX": 1.751079E12, "maxY": 3.3333333333333335, "series": [{"data": [[1.751079E12, 3.3333333333333335]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.751079E12, "title": "Total Transactions Per Second"}},
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

