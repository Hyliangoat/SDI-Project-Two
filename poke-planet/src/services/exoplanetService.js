export async function fetchExoplanetData(){
    const apiKey = `MqCuO0PPhLvN4bLXgCOGv3w2U0hd2luGLyEIzsRJ`
    const roguePlanetURL = `https://cors-anywhere.com/https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_orbper,pl_orbeccen,st_teff,pl_rade,pl_masse+from+ps+where+pl_rade+<+=+1.8+and+pl_masse+>+0&format=json&api_key=${apiKey}`
    let retries = 4;
    while(retries > 0){
        try{
            const result = await fetch(roguePlanetURL)

            const json = await result.json()

            return json
        } catch(error) {
            console.log('Fetch failed, trying again')
            retries -= 1;
        }
    }
}