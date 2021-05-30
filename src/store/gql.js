const getGQL = url => 
(query, variables={}) => 
    fetch(url, 
        {method: 'POST', 
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              ...(localStorage.authToken ? {Authorization: `Bearer ${localStorage.authToken}`} : {})
            },
            body: JSON.stringify({query,variables})})
    .then(res => res.json())
    const gql = getGQL('http://player.asmer.fs.a-level.com.ua/graphql')

// const getGQLUpload = url => (query, variables={}) => 
// fetch(`http://player.asmer.fs.a-level.com.ua/track`, 
//     {method: 'POST', 
//         headers: localStorage.authToken ? {Authorization: 'Bearer ' + localStorage.authToken} : {},
//         body: new FormData(trackForm)
// .then(res => res.json())}
    
export default gql;