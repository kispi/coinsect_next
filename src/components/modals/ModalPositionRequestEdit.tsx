'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { api } from '@/lib/api'
import { ui } from '@/lib/ui'
import type { RealTimePosition } from '@/types'
import AppToggler from '@/components/common/AppToggler'

interface Props {
  options: {
    position: RealTimePosition
  }
  onClose: () => void
}

export default function ModalPositionRequestEdit({ options, onClose }: Props) {
  const { t, i18n } = useI18n()
  const p = options.position

  const [payload, setPayload] = useState({
    id: p.id,
    name: p.name,
    entryPrice: p.entryPrice,
    liqPrice: p.liqPrice || 0,
    size: p.size,
    contract: p.contract || 'BTCUSDT',
    onAir: true,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setPayload((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const o = {
        ...payload,
        entryPrice: Number(payload.entryPrice),
        liqPrice: Number(payload.liqPrice),
        size: Number(payload.size),
        token: token,
      }
      await api.post('contents/real_time_positions/change_notifications', o)
      ui.toast.success('TOAST.POSITION_EDIT_REQUESTED')
      onClose()
    } catch (e: any) {
      ui.toast.error(e.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-position-request-edit w-full max-w-[360px] bg-background-base border border-border-base rounded shadow-2xl overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-base bg-background-light/30">
        <h3 className="font-bold text-text-stress">
          {i18n('MODAL.POSITION_NOTIFY_CHANGE').replace('%s', p.name || '')}
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-background-light rounded transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      <div className="p-6 flex flex-col items-center gap-4">
        <div
          className="text-sm text-text-stress text-center"
          dangerouslySetInnerHTML={{
            __html: i18n('MODAL.POSITION_NOTIFY_CHANGE_DESC').replace('%s', p.name || ''),
          }}
        />

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted">{t('COMMON.ENTRY_PRICE')}</label>
            <input
              type="number"
              name="entryPrice"
              value={payload.entryPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light border border-border-base rounded text-sm outline-none focus:border-brand-primary"
              placeholder="40000"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted">{t('COMMON.LIQ_PRICE')}</label>
            <input
              type="number"
              name="liqPrice"
              value={payload.liqPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light border border-border-base rounded text-sm outline-none focus:border-brand-primary"
              placeholder="30000"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted">
              {t('COMMON.SIZE')} {t('COMMON.SIZE_DESC')}
            </label>
            <input
              type="number"
              name="size"
              value={payload.size}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light border border-border-base rounded text-sm outline-none focus:border-brand-primary"
              placeholder="5, -3..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted">{t('COMMON.CONTRACT')}</label>
            <input
              type="text"
              name="contract"
              value={payload.contract}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light border border-border-base rounded text-sm outline-none focus:border-brand-primary"
              placeholder="BTCUSDT"
            />
          </div>
        </div>

        <div
          className="flex items-center justify-between w-full py-2 cursor-pointer no-select"
          onClick={() => setPayload((prev) => ({ ...prev, onAir: !prev.onAir }))}
        >
          <label className="text-sm font-medium cursor-pointer">{t('COMMON.ON_AIR')}</label>
          <AppToggler
            value={payload.onAir}
            onChange={(val) => setPayload((prev) => ({ ...prev, onAir: val }))}
          />
        </div>
      </div>

      <div className="flex justify-center gap-3 p-4 border-t border-border-base">
        <button
          onClick={onClose}
          className="px-8 py-2.5 rounded font-bold text-sm bg-background-light text-text-base hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {t('COMMON.CANCEL')}
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-2.5 rounded font-bold text-sm bg-brand-primary text-white hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? '...' : t('COMMON.CONFIRM')}
        </button>
      </div>
    </div>
  )
}
