
        /* Variables */
    
    var g = 9.81
    var rho = 1.025
    var sigma = 160
    
    /* Objets */
    
    calc_str();
    
    function calc_str(){
        
        /* Get data from string */ 
        
        document.getElementById("L").value = document.getElementById("rL").value
        document.getElementById("B").value = document.getElementById("rB").value
        document.getElementById("D").value = document.getElementById("rD").value
        document.getElementById("Cb").value = document.getElementById("rCb").value
        document.getElementById("Sd").value = document.getElementById("rSd").value 
        document.getElementById("Gd").value = document.getElementById("rGd").value     
        document.getElementById("Lw").value = document.getElementById("rLw").value 
        document.getElementById("Dw").value = document.getElementById("rDw").value
        document.getElementById("DAF").value = document.getElementById("rDAF").value
        document.getElementById("ShipTanks").value = document.getElementById("rShipTanks").value
        document.getElementById("LoadTanks").value = document.getElementById("rLoadtanks").value
        
        /* Assign data to variables */
        
        L = document.getElementById("L").value
        B = document.getElementById("B").value
        D = document.getElementById("D").value
        Cb = document.getElementById("Cb").value
        Lw = document.getElementById("Lw").value
        Dw = document.getElementById("Dw").value
        s = document.getElementById("Sd").value
        l = document.getElementById("Gd").value
        DAF = document.getElementById("DAF").value
        ST = document.getElementById("ShipTanks").value
        LT = document.getElementById("LoadTanks").value
        
        /* Equations */
        
        Displacement= +Lw + +Dw
        Draft = Displacement / (L * B * Cb * rho)
        Pressure = rho * g * Draft * DAF/1000
        Bg = (B*1000) / 2 
        
        Thickness = s/2*Math.sqrt(Pressure/sigma)
        
        LShipTanks = L / ST

        Z = (Pressure * s * Math.pow(l,2))/(12 * sigma)/1000
        Zg = (Pressure * l * Math.pow(Bg,2))/(10 * sigma)/1000
                
        Buoyancy = Displacement / L
        LwD = Lw / L
        DwD = Dw / (L*LT/ST)
        ResLoadFull = +Buoyancy - +DwD - +LwD
        ResLoadEmpty = +Buoyancy - +LwD
        
        /* Plots */
        
        // Force & Moment Plot 
        
        // Force
        
        var x = [];
        ii = 0;
        iii = 0;
        for ( i = 0 ;  i <= ST; i++)
            x.push(i*L/ST);
        
        var y = [];
        
        for ( i = 0 ; i <= ST; i++){
            if (i === 0){
                y.push(0);
                continue;
            }else if (i <= LT/2) {
                y.push(i * L / ST * ResLoadFull);
                continue;
                }else if (i <= ST-+LT/2){
                    ii = ii + 1;
                    SumLoad1 = LT/2 * L / ST *ResLoadFull;
                    y.push(SumLoad1+L / ST * ResLoadEmpty * (ii));
                    continue;
                    }else {
                        iii = iii + 1;
                        SumLoad2 = SumLoad1 + L / ST * ResLoadEmpty * (ii);
                        y.push(SumLoad2 + L / ST * ResLoadFull * (iii));
                       
                        continue;
                    }
                                    
        }
        
        if (LT === ST) {
            y = [];
            for ( i = 0; i <= ST; i++)
                y.push(0)
                
        }
        
        var MaxFor = y.reduce(function(a,b){
                               return Math.max(a,b);
                               });
        var type = 'scatter'
        var name = 'Force'
        Force = { x, y, type, name}
        
        // Moment 
        
        ii = LShipTanks * (ST - (ST - LT/2) - 1);
        var y1 = []
        
        for ( i = 0; i <= L/2; i += LShipTanks){
            if (i <= LShipTanks * LT/2){
                y1.push( (-ResLoadFull / 2 * Math.pow(i, 2)) / 100);
                continue;
            }
            else {
                y1.push ((-ResLoadFull * LShipTanks * LT / 2 * (i - LShipTanks) - ResLoadEmpty * (i - LShipTanks * LT / 2) * (i - LShipTanks * LT / 2) / 2) / 100)
                continue;
            }
        }
        if (LT === 12){
            y1.push ((-ResLoadFull * LShipTanks * LT / 2 * (6 - LShipTanks) - ResLoadEmpty * (6 - LShipTanks * LT / 2) * (6 - LShipTanks * LT / 2) / 2) / 100)
        }
        var MomMax = y1.reduce(function(a,b){
                               return Math.max(a,b);
                               });
        var y2 = y1.slice();
        y2.pop();
        y2.reverse();
        
        var y = y1.concat(y2);
        
        var mode = 'markers'
        var type = 'scatter'
        var name = 'Moment'
        
        Moment = {x, y, mode, type, name}
        
        
        var data = [Force, Moment];
        var layout = {
            title: 'Force and Moment Representation',
            xaxis:{
                title : 'Lenght of the Ship',
                titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f',
                }
            },
            yaxis:{
                title : 'Force N, Moment MN*m',
                titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f',
                }
            }
        
        }
        Plotly.newPlot('myDiv', data, layout);        
        
    
        /* Plate table */
              
        if (Z < 24) {
            var I = 165
            var Px = 80
            var Py = 5
        }else 
            if (Z < 26){
                var I = 181
                var Px = 80
                var Py = 6
            }else
                if (Z < 36){
                    var I = 196
                    var Px = 80
                    var Py = 7
            }else
                if (Z < 39){
                var I = 338
                var Px = 100
                var Py = 6
            }else
                if (Z < 43){
                var I = 365
                var Px = 100
                var Py = 7
            }else
                if (Z < 52){
                var I = 391
                var Px = 100
                var Py = 8
            }else
                if (Z < 56){
                var I = 567
                var Px = 120
                var Py = 6
            }else
                if (Z < 61){
                var I = 610
                var Px = 120
                var Py = 7
            }else
                if (Z < 78){
                var I = 653
                var Px = 120
                var Py = 8
            }else
                if (Z < 83){
                var I = 968
                var Px = 140
                var Py = 7
            }else
                if (Z < 89){
                var I = 1025
                var Px = 140
                var Py = 8
            }else
                if (Z < 110){
                var I = 1082
                var Px = 140
                var Py = 9
            }else
                if (Z < 117){
                var I = 1590
                var Px = 160    
                var Py = 7
            }else
                if (Z < 125){
                var I = 1684
                var Px = 160
                var Py = 8
            }else
                if (Z < 157){
                var I = 1783
                var Px = 160
                var Py = 9
            }else
                if (Z < 166){
                var I = 2477
                var Px = 180
                var Py = 8
            }else
                if (Z < 177){
                var I = 2594
                var Px = 180
                var Py = 9
            }else
                if (Z < 187){
                var I = 2733
                var Px = 180
                var Py = 10
            }else
                if (Z < 214){
                var I = 2863
                var Px = 180
                var Py = 11
            }else
                if (Z < 225){
                var I = 3630
                var Px = 200
                var Py = 9
            }else
                if (Z < 238){
                var I = 3779
                var Px = 200
                var Py = 10
            }else
                if (Z < 250){
                var I = 3950
                var Px = 200
                var Py = 11
            }else
                if (Z < 288){
                var I = 4110
                var Px = 200
                var Py = 11
            }else
                if (Z <300){
                var I = 5177
                var Px = 220
                var Py = 10
            }else
                if (Z < 311){
                var I = 5353
                var Px = 220
                var Py = 11
            }else
                if (Z < 351){
                var I = 5500
                var Px = 220
                var Py = 12
            }else
                if (Z < 371){
                var I = 6721
                var Px = 240
                var Py = 10
            }else
                if (Z < 385){
                var I = 7031
                var Px = 240
                var Py = 11
            }else
                if (Z < 450){
                var I = 7236
                var Px = 240
                var Py = 11
            }else
                if (Z < 467){
                var I = 9015
                var Px = 260
                var Py = 11
            }else
                if (Z < 483){
                var I = 9269
                var Px = 260
                var Py = 12
            }else
                if (Z < 537){
                var I = 9511
                var Px = 260
                var Py = 13
            }else
                if (Z < 559){
                var I = 11312
                var Px = 280
                var Py = 11
            }else
                if (Z < 578){
                var I = 11657
                var Px = 280
                var Py = 12
            }else
                if (Z < 639){
                var I = 11955
                var Px = 280
                var Py = 13
            }else
                if (Z < 664){
                var I = 14073
                var Px = 300
                var Py = 11
            }else
                if (Z < 688){
                var I = 14481
                var Px = 300
                var Py = 12
            }else
                if (Z < 709){
                var I = 14589
                var Px = 300
                var Py = 13
            }else
                if (Z < 725){
                var I = 15199
                var Px = 300
                var Py = 14
            }else
                var I = "No data for this value";
        
                /* Can't add those lines, they override the Px, Py for any if statement
                var Px = "No data for this value"
                var Py = "No data for this value"
        
        */
        /*Bottom Plate */
        
        Teq = Thickness + Px * Py / s 
        NAPlat = LShipTanks / 2 * 1000
        InertPlat = (l / 2 * Teq * Math.pow (NAPlat, 2) * 2 + 1 / 12 * Math.pow (LShipTanks * 1000, 3) * Teq)
        ZPlat = (InertPlat / (NAPlat))/1000

        /* DNV RUles */
        
        var Cw = [];
        if (L <= 100) {
            Cw.push (0.0792 * L)
        }else if (L <= 300){
            Cw.push (10.75 - +Math.pow(((300 - +L)/100), 3/2)) 
        }else if (L <= 350){
            Cw.push(10.75)
        }else {
            Cw.push (10.75 - +Math.pow(((L - +350)/150), 3/2)) 
        }
        
        var MSO = Cw * Math.pow(L, 2) * B * (0.1225 - +0.015 * Cb)
        var MWO = 0.19 * Cw * Math.pow(L, 2) * B * Cb
        
        var MaxMSO = Math.max (MSO, MomMax * 1000)
        var TotMom = MaxMSO + +MWO 
        var SecMod = TotMom / 175 * 100
        
        var CompMod = ZPlat - SecMod
        if (CompMod < 0){
            var Final = "Insufficent plate thickness. Change initial conditions (s, l)"
            }
            else  {
                var Final = "Plate holds"
            }
        
                                    
        /* Assign value obtained to variables for screen */
        
        document.getElementById("Dr").innerHTML = Draft
        document.getElementById("Pr").innerHTML = Pressure
        document.getElementById("Disp").innerHTML = Displacement
        document.getElementById("t").innerHTML = Thickness
        document.getElementById("teq").innerHTML = Teq
        document.getElementById("Z").innerHTML = Z
        document.getElementById("Zg").innerHTML = Zg
        document.getElementById("I").innerHTML = I
        document.getElementById("Px").innerHTML = Px
        document.getElementById("Py").innerHTML = Py
        document.getElementById("Buo").innerHTML = Buoyancy
        document.getElementById("LwD").innerHTML = LwD
        document.getElementById("DwD").innerHTML = DwD
        document.getElementById("ResLoadFull").innerHTML = ResLoadFull
        document.getElementById("ResLoadEmpty").innerHTML = ResLoadEmpty
        document.getElementById("MaxMom").innerHTML = MomMax
        document.getElementById("MaxFor").innerHTML = MaxFor
        document.getElementById("Cw").innerHTML = Cw
        document.getElementById("MSO").innerHTML = MSO
        document.getElementById("MWO").innerHTML = MWO
        document.getElementById("InertPlat").innerHTML = InertPlat        
        document.getElementById("ZPlat").innerHTML = ZPlat
        document.getElementById("MaxMSO").innerHTML = MaxMSO
        document.getElementById("TotMom").innerHTML = TotMom
        document.getElementById("SecMod").innerHTML = SecMod
        document.getElementById("Final").innerHTML = Final

                
        }
