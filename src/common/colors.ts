import placeBlue from '../assets/placeBlue.svg'
import placeGreen from '../assets/placeGreen.svg'
import placeRed from '../assets/placeRed.svg'
import placeYellow from '../assets/placeYellow.svg'
import { Color } from '../style'

export const chooseColor = (color: string) => {
  switch (color) {
    case Color.Red:
      return placeRed
    case Color.Yellow:
      return placeYellow
    case Color.Green:
      return placeGreen
    default:
      return placeBlue
  }
}
