import { useContext, useEffect } from 'react'
import { ScheduleModalContext } from '../components/layout/AppShell'

const ScheduleCreateTabPage = () => {
  const modal = useContext(ScheduleModalContext)

  useEffect(() => {
    modal?.openCreate()
    return () => modal?.closeCreate()
  }, [modal])

  return null
}

export default ScheduleCreateTabPage
