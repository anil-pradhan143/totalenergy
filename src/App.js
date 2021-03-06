import React, { useState } from 'react';
import './App.css';
import Charts from './ChartApp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebase from './FirebaseConfig';
import { BeatLoader } from 'react-spinners';
import * as moment from "moment";


function App() {
  const [uname, setUname] = useState('')
  const [electriciy, setElectriciy] = useState('')
  const [solar, setSolar] = useState('')
  const [gas, setGas] = useState('')
  const [wind, setWind] = useState('')
  const [percent, setPercent] = useState('')
  const [totalEnergy, setTotalEnergy] = useState('')
  const [chartData, setChartData] = useState([])
  const [showchart, setShowChart] = useState(false)
  const [loader, setLoader] = useState(false)
  var todayDate = new Date();
  var tod = moment(todayDate).format('MM/DD/YYYY HH:mm:ss');
  var currYear = moment(todayDate).format('YYYY');

  function getFloatValue(num) {
    return parseFloat(num);
  }
  function calculateTotalEnergy() {
    var total = 0;
    chartData.map(val => {
      total += val.value;
    })
    setTotalEnergy(total);
  }
  function calculteUnit(kwTObaht) {
    var cal = (parseFloat(kwTObaht) * 10); // randomly taken one value 1kWh unit will cost 10 Baht
    return formatPrice(cal)
  }
  function formatPrice(price) {
    return new Intl.NumberFormat('en-IN').format(Math.ceil(price));
  }
  function onSubmit(e) {
    if (uname === '') { toast.info("Please enter your name"); return false; }
    else if (electriciy === '') { toast.info("Please enter the electricity value"); return false; }
    else if (solar === '') { toast.info("Please enter the solar value"); return false; }
    else if (gas === '') { toast.info("Please enter the gas value"); return false; }
    else if (wind === '') { toast.info("Please enter the wind value"); return false; }

    setShowChart(true);
    setLoader(true)
    chartData.splice(0, chartData.length);
    chartData.push({ "entity": "electriciy", "value": getFloatValue(electriciy) });
    chartData.push({ "entity": "solar", "value": getFloatValue(solar) });
    chartData.push({ "entity": "gas", "value": getFloatValue(gas) });
    chartData.push({ "entity": "wind", "value": getFloatValue(wind) });
    setPercent(percent);
    calculateTotalEnergy();
    updateFirebaseData();

    console.log("Data are:" + JSON.stringify(chartData));

  }
  function updateFirebaseData() {
    firebase.database().ref(currYear + '/' + uname).set({
      chartData: chartData,
      date: tod
    }, function (error) {
      if (error) {
        toast.error("Data updation is failed");
      } else {
        getChart();
        setLoader(false);
        toast.success("Data saved successfully!");
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
                <div className="card col-md-12 bg-blue">
                  <div className="col-md-12"> <h3>Input Fields</h3></div>
                  <div className="col-md-12">
                    <input type="text" pattern="" placeholder="Your Name" style={{ width: '100%' }} value={uname} onChange={event => setUname(event.target.value)}></input>
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
                      css={{
                        display: "block",
                        borderColor: "red",
                        textAlign: "center",
                        margin: "200px auto"
                      }}
                      sizeUnit={"px"}
                      size={15}
                      color={'#123abc'}
                      loading={loader}
                    />
                  </div>
                  :
                  <>
                    <div className="card col-md-8 chart">
                      <div className="col-md-12">
                        <h4 className="portion">Portion of Energy</h4>
                      </div>

                      <div className="col-md-12">
                        <div className="col-md-6">

                          {getChart()}
                        </div>
                        <div className="col-md-6">
                          <p style={{ marginTop: '50px' }}>Total Energy</p>
                          <h4 style={{ color: '#850aad' }}>{formatPrice(totalEnergy)} KW</h4>
                        </div>

                      </div>
                      <div className="col-md-12 p-0">
                        <div className="col-md-6">

                          <div className="col-md-2 p-0">
                            <i className='fas fa-lightbulb m-tb-10 elec_icon'></i>
                          </div>
                          <div className="col-md-10 p-0">
                            <h4 > Electricity</h4>
                            <p >{electriciy} kWh</p>
                            <p style={{ color: '#850aad', fontWeight: '600' }}>{calculteUnit(electriciy)} Baht</p>
                          </div>

                        </div>
                        <div className="col-md-6">
                          <div className="col-md-2 p-0">
                            <i className='fas fa-sun m-tb-10 solar_icon'></i>
                          </div>
                          <div className="col-md-10 p-0">
                            <h4>  Solar</h4>
                            <p>{solar} kWh</p>
                            <p style={{ color: '#850aad', fontWeight: '600' }}>{calculteUnit(solar)} Baht</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 p-0">
                        <div className="col-md-6">
                          <div className="col-md-2 p-0">
                            <i className='fas fa-gas-pump m-tb-10 gas_icon'></i>
                          </div>
                          <div className="col-md-10 p-0">
                            <h4> Gas</h4>
                            <p>{gas} kWh</p>
                            <p style={{ color: '#850aad', fontWeight: '600' }}>{calculteUnit(gas)} Baht</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="col-md-2 p-0">
                            <i className='fas fa-wind m-tb-10 wind_icon'></i>
                          </div>
                          <div className="col-md-10 p-0">
                            <h4> Wind</h4>
                            <p>{wind} kWh</p>
                            <p style={{ color: '#850aad', fontWeight: '600' }}>{calculteUnit(wind)} Baht</p>
                          </div>
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
