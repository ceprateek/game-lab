import useGameStore from '../../store/gameStore'
import { getLevelById } from '../../data/levels'
import SceneWrapper from '../illustrations/SceneMap'
import PlanningPhase from '../game/PlanningPhase'
import ExecutionPhase from '../game/ExecutionPhase'
import ReflectPhase from '../game/ReflectPhase'
import Button from '../ui/Button'

export default function GameplayScreen() {
  const { currentLevelId, gamePhase, navigateTo, attempts } = useGameStore()
  const level = getLevelById(currentLevelId)

  if (!level) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <p className="text-white/50">Level not found</p>
      </div>
    )
  }

  const phaseLabels = {
    planning: 'Plan Your Strategy',
    executing: 'Executing...',
    reflecting: 'Reflect & Learn',
  }

  return (
    <SceneWrapper levelId={currentLevelId}>
      <div className="h-full w-full flex flex-col">
        {/* Top bar - semi-transparent over the scene */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-black/30 backdrop-blur-sm">
          <Button variant="ghost" size="sm" onClick={() => navigateTo('levelSelect')}>
            ← Map
          </Button>
          <div className="text-center">
            <span className="text-white/80 text-xs font-bold uppercase tracking-wider">
              {phaseLabels[gamePhase]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {attempts > 0 && (
              <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-lg">
                Attempt {attempts}
              </span>
            )}
            <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-lg">
              Lv.{level.id}
            </span>
          </div>
        </div>

        {/* Phase content - with semi-transparent backdrop for readability */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-black/40 backdrop-blur-[2px]">
            {gamePhase === 'planning' && <PlanningPhase />}
            {gamePhase === 'executing' && <ExecutionPhase />}
            {gamePhase === 'reflecting' && <ReflectPhase />}
          </div>
        </div>
      </div>
    </SceneWrapper>
  )
}
