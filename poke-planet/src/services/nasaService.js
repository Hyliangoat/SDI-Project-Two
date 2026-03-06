export async function fetchImageData(data){

    try{
        const result = await fetch(`https://images-api.nasa.gov/search?q=${data}`)

        const json = await result.json()

        return json.collection.items[0].links[0].href
    } catch(error) {
        console.log('Fetch failed, trying again')
    }
}