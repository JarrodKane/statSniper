// export const handleSubmitSteamId = async (steamId: string, ) => {
//   try {
//     setLoading(true)
//     const data = await fetch(`${BASE_URL}/user/create`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ steamId })
//     })

//     const json = await data.json()
//     console.log(json)
//   } catch (error) {
//     console.error(error)
//   } finally {
//     setLoading(false)
//   }
//   // TODO: Handle errors, and handle success
// }
