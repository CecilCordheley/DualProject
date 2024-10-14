function getFollow() {
  const informations = document.getElementById("nbFollow");
  const myHeaders = new Headers();
  myHeaders.append("Client-Id", "wb27474oevxe4alz4ffm3wcg26kef6");
  myHeaders.append("Authorization", "Bearer 0cirt4r8f4qskb1ox084aufta82qop");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch("https://api.twitch.tv/helix/channels/followers?broadcaster_id=721260098", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      // console.dir(JSON.parse(result));
      informations.innerHTML = "Votre chaine compte " + JSON.parse(result).total;
    })
    .catch((error) => console.error(error));
}
async function getLiveInformation(broadCaster) {
  // URL et options pour la requête d'obtention du token
  const tokenUrl = "https://id.twitch.tv/oauth2/token";
  const clientId = "wb27474oevxe4alz4ffm3wcg26kef6";
  const clientSecret = "qeaxs2vognultk41g3p8h5dmvwwofy";
  const tokenRequestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
  };

  try {
    // Obtenir le token d'accès
    const tokenResponse = await fetch(tokenUrl, tokenRequestOptions);
    const tokenResult = await tokenResponse.json();
    const accessToken = tokenResult.access_token;

    if (accessToken) {
      // Options pour la requête d'informations sur la chaîne
      const channelUrl = `https://api.twitch.tv/helix/users?login=${broadCaster}`;
      const channelRequestOptions = {
        method: "GET",
        headers: {
          "Client-Id": clientId,
          "Authorization": `Bearer ${accessToken}`
        }
      };

      // Obtenir les informations sur la chaîne
      const channelResponse = await fetch(channelUrl, channelRequestOptions);
      const channelResult = await channelResponse.json();
      console.log("Channel Result:", channelResult);

      if (channelResult.data && channelResult.data.length > 0) {
        const broadcasterId = channelResult.data[0].id;
      //  console.log("Broadcaster ID:", broadcasterId);
        let profileImage=channelResult.data[0].profile_image_url;
        console.log(profileImage);
        // URL et options pour récupérer les règles du chat
        const chatRulesUrl = `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`;
        const chatRulesRequestOptions = {
          method: "GET",
          headers: {
            "Client-Id": clientId,
            "Authorization": `Bearer ${accessToken}`
          }
        };

        // Obtenir les règles du chat
        const chatRulesResponse = await fetch(chatRulesUrl, chatRulesRequestOptions);
        const chatRulesResult = await chatRulesResponse.json();

      //  console.log("Chat Rules:", chatRulesResult.data);
        return {channel:channelResult.data[0]};
      } else {
        console.error("Broadcaster not found");
      }
    } else {
      console.error("Failed to obtain access token");
    }
  } catch (error) {
    console.error(error);
  }
}

// Utilisation de la fonction
