import { Field, Label, Radio, RadioGroup } from '@headlessui/react'

import { scriptureUrlTypes } from '../lib/constants'
import useScriptureUrlType from '../hooks/use-scripture-url-type'

export default function SelectScriptureUrlType() {
  const { scriptureUrlType, setScriptureUrlType } = useScriptureUrlType()
  return (
    <>
      <RadioGroup
        value={scriptureUrlType}
        onChange={setScriptureUrlType}
        aria-label='scriptureUrlType'
        className='flex flex-col space-y-2'
      >
        {scriptureUrlTypes.map(s => (
          <Field key={s} className='flex items-center gap-2'>
            <Radio
              value={s}
              className='group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-blue-400'
            >
              <span className='invisible size-2 rounded-full bg-white group-data-checked:visible' />
            </Radio>
            <Label>{s}</Label>
          </Field>
        ))}
      </RadioGroup>
    </>
  )
}
