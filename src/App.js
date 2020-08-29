import React, { useState } from 'react';
import './App.css';
import Charts from './ChartApp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebase from './FirebaseConfig';
import { BeatLoader } from 'react-spinners';



function App() {
  const [electriciy, setElectriciy] = useState('')
  const [solar, setSolar] = useState('')
  const [gas, setGas] = useState('')
  const [wind, setWind] = useState('')
  const [percent, setPercent] = useState('')
  const [totalEnergy, setTotalEnergy] = useState('')
  const [chartData, setChartData] = useState([])
  const [showchart, setShowChart] = useState(false)
  const [loader, setLoader] = useState(false)

 

  function getFloatValue(num) {
    return parseFloat(num)
  }
  function calculateTotalEnergy() {
    var total = 0;
    chartData.map(val => {
      total += val.value;
    })
    setTotalEnergy(total);
  }
  function calculteUnit(kwTObaht) {
    return (parseFloat(kwTObaht) * 10); // randomly taken one value 1kWh unit will cost 10 Baht
  }
  function onSubmit(e) {
    if (electriciy === '') { toast.info("Please enter the electricity value"); return false; }
    else if (solar === '') { toast.info("Please enter the solar value"); return false; }
    else if (gas === '') { toast.info("Please enter the gas value"); return false; }
    else if (wind === '') { toast.info("Please enter the wind value"); return false; }

    setShowChart(true);
    setLoader(true)
    chartData.push({ "product": "electriciy", "value": getFloatValue(electriciy) });
    chartData.push({ "product": "solar", "value": getFloatValue(solar) });
    chartData.push({ "product": "gas", "value": getFloatValue(gas) });
    chartData.push({ "product": "wind", "value": getFloatValue(wind) });
    setPercent(percent);
    calculateTotalEnergy();
    updateFirebaseData();

    console.log("Data are:" + JSON.stringify(chartData));

  }
  function updateFirebaseData() {
    firebase.database().ref('totalEnergyData/' + "2020").set({
      chartData: chartData
    }, function (error) {
      if (error) {
        toast.error("Data updation is failed");
      } else {
        toast.success("Data saved successfully!");
        getChart();
        setLoader(false);
      }
    });
  }
  function getChart() {
    return (
      <Charts datapoint={chartData} percent={percent} />
    )
  }

  return (
    <>
      <header>
        <ToastContainer />

        <div className="col-md-12 ">
          <div className="col-md-6 App" >
            <div className="col-md-8">
              <div className="row">
                <div className="card col-md-12" style={{ backgroundColor: '#2276ccbd', margin: '20px 0px' }}>
                  <div className="col-md-12"> <h3>Input Fields</h3></div>
                  <div className="col-md-12">
                    <input type="text" pattern="\d*\.?\d*" placeholder="Electricity" style={{ width: '100%' }} value={electriciy} onChange={event => setElectriciy((event.target.validity.valid) ? event.target.value : electriciy)}></input>
                    <input type="text" pattern="\d*\.?\d*" placeholder="Solar" value={solar} onChange={event => setSolar((event.target.validity.valid) ? event.target.value : solar)}></input>
                    <input type="text" pattern="\d*\.?\d*" placeholder="Gas" value={gas} onChange={event => setGas((event.target.validity.valid) ? event.target.value : gas)}></input>
                    <input type="text" pattern="\d*\.?\d*" placeholder="Wind" value={wind} onChange={event => setWind((event.target.validity.valid) ? event.target.value : wind)}></input>
                    <input type="text" pattern="\d*\.?\d*" placeholder="Energy Percentage" value={percent} onChange={event => setPercent((event.target.validity.valid) ? event.target.value : percent)}></input>
                  </div>
                  <div className="col-md-12" style={{ padding: '15px 30px' }}>
                    <button onClick={(e) => onSubmit(e)}>Submit</button>
                  </div>
                </div>
                {!showchart && <h4>Please enter all the values and click on submit.</h4>}
              </div>
            </div>

          </div>

          <div className="col-md-6">
            {showchart &&
              <>
                {loader ?
                  <div className="col-md-12 m-tb-10 text-center">
                    <BeatLoader
                      css={{display: "block",
                        borderColor: "red",
                        textAlign:"center",
                        margin:"200px auto"}}
                      sizeUnit={"px"}
                      size={15}
                      color={'#123abc'}
                      loading={loader}
                    />
                  </div>
                  :
                  <>
                    <div className="card col-md-8" style={{ margin: '20px 0px', borderRadius: '15px', overflow: 'hidden' }}>
                      <div className="col-md-12">
                        <h4 style={{ textTransform: 'uppercase', fontWeight: '700', float: 'left', marginTop: '20px' }}>Portion of Energy</h4>
                      </div>

                      <div className="col-md-12">
                        <div className="col-md-6">

                          {getChart()}
                        </div>
                        <div className="col-md-6">
                          <p style={{ marginTop: '50px' }}>Total Energy</p>
                          <h4 style={{ color: '#850aad' }}>{totalEnergy} KW</h4>
                        </div>

                      </div>
                      <div className="col-md-12">
                        <div className="col-md-6">
                          <h4 style={{ color: 'rgb(103, 183, 220)' }}>Electricity</h4>
                          <p >{electriciy} kWh</p>
                          <p style={{ color: '#850aad' }}>{calculteUnit(electriciy)} Baht</p>
                        </div>
                        <div className="col-md-6">
                          <h4 style={{ color: 'rgb(103, 148, 220)' }}>Solar</h4>
                          <p>{solar} kWh</p>
                          <p style={{ color: '#850aad' }}>{calculteUnit(solar)} Baht</p>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="col-md-6">
                          <h4 style={{ color: 'rgb(103, 113, 220)' }}>Gas</h4>
                          <p>{gas} kWh</p>
                          <p style={{ color: '#850aad' }}>{calculteUnit(gas)} Baht</p>
                        </div>
                        <div className="col-md-6">

                          <h4 style={{ color: 'rgb(128, 103, 220)' }}>Wind</h4>
                          <p>{wind} kWh</p>
                          <p style={{ color: '#850aad' }}>{calculteUnit(wind)} Baht</p>
                        </div>
                      </div>
                    </div>
                    <div className="card col-md-8">
                      <p><strong>Chart :</strong> Used amChats for this, due to  watermark that appearing little bit in right</p>
                      <p><strong>Total Energy =</strong> Simple addition of Electricity,Solar,Gas,Wind</p>
                      <p><strong>Amount (Baht) : </strong>used one simple logic 1 kWh costs 10 Baht</p>
                    </div>
                  </>
                }
              </>
            }
          </div>

        </div>

      </header>
    </>
  );
}

export default App;
