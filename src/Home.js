import React, { useEffect, useState } from 'react'

const pageSize =20

const Home = () => {
    const [tableData, setTableData] = useState({data: []});
    const [search, setSearch] = useState("");
    const[active, setActive]= useState(1);
    const [offset, setOffset] = useState(0);
    const [asset, setAsset] = useState("");
    const [priceChange, setPriceChange] = useState("black");


    const handleOffset = (next)=> {
        setOffset((next-1)*pageSize)
    }

    const [cryptoData,setCryptoData] = useState([])
    //const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${asset}`);
    useEffect(()=> {
        const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${asset}`);
        ws.onmessage = (msg)=> {
          setCryptoData((prev)=> {
              const prices = JSON.parse(msg.data);
              const price = {}
              if(Object.keys(prev).length) {
                  Object.keys(prev).map((key)=> {
                      if(prev[key] > prices[key]) {
                          price[key] = "green";
                      } else {
                          price[key] = "red";
                      }
                  });
                }
             setPriceChange(price);
              console.log(prev, JSON.parse(msg.data))
            return JSON.parse(msg.data)
          });
        }
        return ()=>{ws.close()}
        }, [asset])
    


    const getData =async ()=> {
        const res = await fetch(`https://api.coincap.io/v2/assets?search=${search}&offset=${offset}&limit=${pageSize}`);
        const data = await res.json();
        const assetList = data.data.map((crp)=> {
            return crp.id
        });
        setAsset(assetList.join(","));
        setTableData(data);
    }

    useEffect(()=>{
        getData()
    },[search,pageSize, active]);
 
    const pageCount = tableData.data.length === 20 ? Math.ceil(100/pageSize): 0;
    let  pages = []
    for(let i=1;i<=pageCount;i++){
        pages.push(i)
    }
  return (
    <>
    <div>
        <h2>Cryptocurrency Prices</h2>
    </div>
    <div className='container'>
        <div className='searchContainer'>
        <form
        >
        <input 
        type="text" 
        placeholder="Search.." 
        name="search"
        value={search}
        onChange ={(e)=>{setSearch(e.target.value)}}
        />
        </form>
        </div>
    <table>
  
  <tr>
    <th>Name</th>
    <th>Rank</th>
    <th>Symbol</th>
    <th>Supply</th>
    <th>MaxSupply</th>
    <th>MarketCapUsd</th>
    <th>volumeUsd24Hr</th>
    <th>priceUsd</th>
    <th>changePercent24Hr</th>
    <th>vwap24Hr</th>
  </tr>
  <tbody>
   {
       tableData.data.map((ele,index)=>{
           return(
            <tr key={index}>
            <td>{ele.name}</td>
            <td>{ele.rank}</td>
            <td>{ele.symbol}</td>
            <td>{parseInt(ele.supply).toFixed(2)}</td>
            <td>{ele.maxSupply}</td>
            <td>{parseInt(ele.marketCapUsd).toFixed(2)}</td>
            <td>{parseInt(ele.volumeUsd24Hr).toFixed(2)}</td>
            <td style={{color: priceChange[ele.name.toLowerCase()]}}>{cryptoData[ele.name.toLowerCase()] || ele.priceUsd}</td>
            <td>{ele.changePercent24Hr}</td>
            
            <td>{parseInt(ele.vwap24Hr).toFixed(2)}</td>
          </tr>
           )
       })
   } 
   </tbody>
</table>

<div className="pagination">
<a href="#">&laquo;</a>
    {
        pages.map((ele)=>{
            return(<a className ={`${ele === active? "active" : ""}`} href="#" onClick={(e)=> {setActive(ele); handleOffset(ele)}}>{ele}</a>)
        })
    }
<a href="#">&laquo;</a>
</div>
    </div>
    </>

)
}

export default Home