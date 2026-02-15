import JungleScene from './scenes/JungleScene'
import RiverScene from './scenes/RiverScene'
import CaveScene from './scenes/CaveScene'

const sceneMap = {
  1: JungleScene,
  2: RiverScene,
  3: CaveScene,
}

export default function SceneWrapper({ levelId, children, className = '' }) {
  const Scene = sceneMap[levelId] || JungleScene
  return (
    <Scene className={className}>
      {children}
    </Scene>
  )
}

export { JungleScene, RiverScene, CaveScene }
