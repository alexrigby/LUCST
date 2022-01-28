// GETS THE TEXT VALUES OF A DATASET FROM A URL 
export async function fetchData(url) {
  // console.log(url)
  return await fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Could not load data: ${res.status}`);
      } else {
        return res.text();
      }
    });
}

//exports functions
export default fetchData