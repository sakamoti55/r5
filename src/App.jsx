import { useEffect, useState } from "react";

//A国での通貨をB国での通貨価値に換算する
async function fetchCategory(data, Acountry, Bcountry) {
    const Arate = data.conversion_rates[Acountry];
    const Brate = data.conversion_rates[Bcountry];

    const ratio = parseFloat(Brate) / parseFloat(Arate);
    return ratio;
}


export default function App() {
    const [data, setData] = useState(); //データを管理するステート(letより良い？っぽい)
    
    const [exchangedAmount,setExchangedAmount] = useState();
    const [amount, setAmount] = useState("");
    const [Acountry, setAcountry] = useState("USD");
    const [Bcountry, setBcountry] = useState("USD");

    //開いたとき、変更を加えたときに処理
    useEffect(() => {
        //関数
        const fetchData = async () => {
            const url = await fetch("https://v6.exchangerate-api.com/v6/a2e107b618f039cf1ee3d80a/latest/USD");
            //const url = await fetch("public/rate.json");
            const result = await url.json();
            setData(result);
        };
    
        fetchData();
    }, []);

    async function handleClick(event) {
        event.preventDefault();
        
        const newRatio = await fetchCategory(data, Acountry, Bcountry);    
        const roundedValue = parseFloat(((amount) * newRatio).toFixed(2));    
        setExchangedAmount(roundedValue);
    }
    


  return (
    <>
      <header>
        <h1>Exchange money</h1>
      </header>
      <div>
        <aside>
          <form>
            <div class="div0">
              <label htmlFor="category">Choose a Country to Country</label> 
            </div>
            <div class="div1">
              <select class="a"
                id="category" 
                //asyncは必要ない
                onChange={(event) => setAcountry(event.target.value)
                }
              >
                {data && Object.keys(data.conversion_rates).map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                        {countryCode}
                    </option>
                ))}
              </select>

              <p>→</p>

              <select class="b"
                id="category2" 
                onChange={(event) => setBcountry(event.target.value)
                }

              >

                {data && Object.keys(data.conversion_rates).map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                        {countryCode}
                    </option>
                ))}
              </select>
            </div>
            <div class="div2">
              <label htmlFor="enterAmount">Enter amount:</label>
              <input 
                type="text" 
                id="enterAmount" 
                placeholder="num" 
                value={amount}
                onChange={(event) => setAmount(event.target.value) 
              }         
              >
              </input>           
              <button onClick={handleClick}>Filter results</button>
            </div>
          </form>
        </aside>
      </div>
      <div>
        <main>
            <h2>
                {Acountry} to {Bcountry}
            </h2>
            {/* &&は左辺評価→右辺評価　右辺が真なら右辺の結果を出力 */} 
            {exchangedAmount !== null && (
            <p>
              Exchanged Amount: {exchangedAmount} {Bcountry}
            </p>
            )}
            {/*下に主要な国の通貨への両替だけピックアップして書くかも*/}
            <h2>
              exchange rate
            </h2>
            {data && (
              <ul>              
                <li>1$ USD: ${data.conversion_rates.USD}</li>

                <li>1\ JPY : ${data.conversion_rates.JPY}</li>  

                <li>1€ EUR: ${data.conversion_rates.EUR}</li>
              </ul> 
            )}
        </main>
      </div>
    </>
  );
}