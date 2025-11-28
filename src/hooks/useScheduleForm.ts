import { useState } from 'react'
import dayjs from 'dayjs'
import type { ScheduleFormValues } from '../types/schedule'
import { toApiDateTimeKST } from '../utils/datetime'

const defaultDate = dayjs().tz().minute(0).second(0)

const initialFormValues: ScheduleFormValues = {
  title: '',
  description: '',
  date: defaultDate.toDate(),
  deadline: defaultDate.add(2, 'hour').toDate(),
  importance: 5,
  urgency: 5,
  taskType: 'DEEP_WORK',
  estimatedMinutes: 60,
  previousTaskIds: [],
  nextTaskIds: [],
}

type UseScheduleFormReturn = {
  values: ScheduleFormValues
  errors: Partial<Record<keyof ScheduleFormValues, string>>
  isSubmitting: boolean
  onChange: <K extends keyof ScheduleFormValues>(key: K, value: ScheduleFormValues[K]) => void
  onSubmit: () => Promise<void>
  reset: () => void
}

const useScheduleForm = (): UseScheduleFormReturn => {
  const [values, setValues] = useState<ScheduleFormValues>(initialFormValues)
  const [errors, setErrors] = useState<Partial<Record<keyof ScheduleFormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors: Partial<Record<keyof ScheduleFormValues, string>> = {}
    if (!values.title.trim()) nextErrors.title = '제목을 입력해 주세요.'
    if (!values.description.trim()) nextErrors.description = '설명을 입력해 주세요.'
    if (dayjs(values.deadline).isBefore(values.date)) {
      nextErrors.deadline = '마감일은 시작 시간 이후여야 합니다.'
    }
    if (values.importance < 1 || values.importance > 9) {
      nextErrors.importance = '중요도는 1~9 사이여야 합니다.'
    }
    if (values.urgency < 1 || values.urgency > 9) {
      nextErrors.urgency = '긴급도는 1~9 사이여야 합니다.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onChange = <K extends keyof ScheduleFormValues>(key: K, value: ScheduleFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        date: toApiDateTimeKST(values.date),
        deadline: toApiDateTimeKST(values.deadline),
      }
      await new Promise((resolve) => setTimeout(resolve, 200))
      console.info('Schedule payload', payload)
      setValues(initialFormValues)
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setValues(initialFormValues)
    setErrors({})
  }

  return {
    values,
    errors,
    isSubmitting,
    onChange,
    onSubmit,
    reset,
  }
}

export default useScheduleForm
