import { timelineActions } from "./store"

export function onMouseDown(e,card,styles,dispatch,item){

    const cardCheck = card?.dataset?.newcard === 'true'

    if(!cardCheck){
        return
    }
    card.style.cursor = 'grabbing'



    card.style.position = 'absolute'
    card.style.zIndex = "5000";   


    const cardCoords = card.getBoundingClientRect()
    
    const xDiff = e.clientX - cardCoords.x
    const yDiff = e.clientY - cardCoords.y

    let timelinePosition = 0
    let timelineScrolled = false

    let cardsMoved = []



   




    function dragCard(e){
        card.style.top = `${e.clientY - yDiff}px`
        card.style.left = `${e.clientX - xDiff}px`  
        const cardCoords = card.getBoundingClientRect()
        
        card.style.display = 'none'
        const elemUnder = document.elementFromPoint(e.clientX,e.clientY)
        card.style.display = 'flex'
        if(elemUnder?.dataset?.timeline){  
            card.classList.add(styles.readyToDrop)
            const checkScroll = window.innerWidth - e.clientX
            const scrollThreshHold = window.innerWidth / 5
            const scrollLeft = checkScroll >  window.innerWidth - scrollThreshHold && timelinePosition < 0
            const scrollRight = checkScroll < scrollThreshHold && timelinePosition > -10000
            if( (scrollLeft || scrollRight) && !timelineScrolled){
                timelineScrolled = true
                setTimeout(() => {
                    timelineScrolled = false
                }, 300);
                timelinePosition = scrollLeft ? timelinePosition + 300 : timelinePosition - 300
                elemUnder.style.transform = `translate(${timelinePosition}px,0)`
            }         
        }else if(elemUnder?.dataset?.index){
            const card = elemUnder.closest('[data-placedcard]')
            const cardUnderCoords = card.getBoundingClientRect()

            const shouldMoveLeft = cardCoords.right - cardUnderCoords.right > 0
            const shouldmoveRight = cardCoords.left - cardUnderCoords.left < 0


            if(shouldMoveLeft || shouldmoveRight){
                const AlreadyMoved = cardsMoved.find(item => item === card) 
                if(!AlreadyMoved) cardsMoved.push(card)
                const previousPos = +card.dataset?.moved || 0                
                let newCoord;
                if(shouldMoveLeft) newCoord = previousPos - 322 >=0 ? previousPos - 322 : null
                if(shouldmoveRight) newCoord = previousPos + 322 <= 322 ? previousPos + 322 : null

                card.dataset.moved = newCoord ? newCoord : previousPos
                card.style.transform = `translateX(${newCoord !== null ?  newCoord : previousPos}px)`                
            }     
        }else{
            if(card.classList.contains(styles.readyToDrop)) card.classList.remove(styles.readyToDrop)
            cardsMoved.forEach(item => item.style.transform = `translateX(0px)`)  
        }
        
            
    }

    function placeCard(e){        
        card.style.display = 'none'
        const elemUnder = document.elementFromPoint(e.clientX,e.clientY)
        card.style.display = 'flex'
        card.style.cursor = 'grab'
        const cardCoords = card.getBoundingClientRect()


        if(elemUnder?.dataset?.timeline){  
            if(card.classList.contains(styles.readyToDrop)) card.classList.remove(styles.readyToDrop)                       
            // const xCoord = Math.round(Math.abs(tlCoords.left))

            // const smallerCheckpoint = cardCoords.x -  (cardCoords.x % 322)
            // const biggerCheckpoint = smallerCheckpoint + 322

            // const gapToSmallCh = cardCoords.x - smallerCheckpoint
            // const gapToBigCh = biggerCheckpoint - cardCoords.x 

            // const rightGap = Math.min(gapToSmallCh,gapToBigCh)

            const month = item.choosedGuess[1].slice(item.choosedGuess.indexOf('|'))
   
            item.answer = [Number.parseInt(item.choosedGuess[1]),Number.parseInt(month)]

            dispatch(timelineActions.addItem(item))                     
        }

        

        card.style.top = `auto`
        card.style.left = `auto` 
        card.style.position = 'static'


        document.removeEventListener(`mousemove`,dragCard)
        card.removeEventListener('mouseup',placeCard)
    }
    


    document.addEventListener(`mousemove`,dragCard)
    card.addEventListener('mouseup',placeCard)
}

export async function getCard(type,setItem,items,initialCard) {
    const resp = await fetch("./api/getRandomCard", {
      method: "POST",
      body: JSON.stringify({
        type: type,
        items: items
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await resp.json();

    const randomGuess = data.card
      ? data.card.years[Math.floor(Math.random() * data.card.years.length)]
      : null;
    data.card.choosedGuess = randomGuess;

    async function getImg() {
      const resp = await fetch("./api/getImage", {
        method: "POST",
        body: JSON.stringify({
          imgTitle: data.card.title,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const image = await resp.json();
      data.card.image = image.imgSource;
    }
    if (data.card) await getImg();

    if(initialCard){
        return data.card
    }
    setItem(data.card);
  }