import React, { useState } from 'react';
import { Cpu, Globe } from 'lucide-react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  Progress,
  Skeleton,
  Tooltip,
} from '../../../components/primitives';
import {
  DataTable,
  Pagination,
  SegmentedControl,
  StatCard,
  WebGLAuroraCanvas,
  type NativeTableVariant,
} from '../../../components/composites';
import { useTheme } from '../../../providers/ThemeProvider';
import type { WebGLShaderPreset } from '../../../core/contracts/ThemeContract';

export const BadgesChipsAvatarsLiveMiniDemo: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState('Liquid Glass');

  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        <Badge tone="primary" pulse>
          Primary Canlı
        </Badge>
        <Badge tone="success" variant="glass" pulse>
          %99.99 SLA
        </Badge>
        <Badge tone="warning" variant="outlined">
          Bellek %82
        </Badge>
        <Badge tone="danger" variant="filled">
          Kritik (2)
        </Badge>
        {['Liquid Glass', 'Dinamik Ton', 'SheetGL 120Hz'].map((c) => (
          <Chip
            key={c}
            selected={selectedChip === c}
            onClick={() => setSelectedChip(c)}
            tone="primary"
          >
            {c}
          </Chip>
        ))}
      </div>

      <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 16 }}>
        <Tooltip content="Ümit Uz • Baş Sistem Mimarı" shortcut="⌘1">
          <Avatar name="Ümit Uz" status="online" shape="squircle" tone="primary" />
        </Tooltip>
        <AvatarGroup max={3}>
          <Avatar name="Deniz Kaya" status="online" tone="success" />
          <Avatar name="Selin Yılmaz" status="busy" tone="warning" />
          <Avatar name="Mert Can" tone="info" />
          <Avatar name="Elif Su" tone="primary" />
        </AvatarGroup>
        <Progress variant="circular" value={84} tone="success" size="md" />
        <div style={{ flex: 1, minWidth: 160 }}>
          <Skeleton variant="text" width="70%" height={12} />
          <div style={{ height: 6 }} />
          <Skeleton variant="squircle" width="100%" height={22} />
        </div>
      </div>
    </div>
  );
};

export const StatCardNativeTableLiveMiniDemo: React.FC = () => {
  const [variant, setVariant] = useState<NativeTableVariant>('striped');
  const [page, setPage] = useState(1);

  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-grid-2">
        <StatCard
          label="Toplam Bulut İşlem Kapasitesi"
          value="148.6 TFLOPS"
          delta="+18.4%"
          trend="up"
          tone="primary"
          subtitle="Son 24 saatlik küme ortalaması"
          icon={<Cpu size={18} />}
          sparklineData={[32, 45, 41, 64, 72, 85, 96]}
        />
        <StatCard
          label="Küresel Uç Gecikmesi (Edge Latency)"
          value="11.2 ms"
          delta="-3.1 ms"
          trend="up"
          tone="success"
          subtitle="İstanbul • Frankfurt • Tokyo"
          icon={<Globe size={18} />}
          sparklineData={[22, 19, 17, 15, 14, 12, 11]}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SegmentedControl<NativeTableVariant>
          size="sm"
          value={variant}
          onChange={setVariant}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'striped', label: 'Striped' },
            { value: 'bordered', label: 'Bordered' },
            { value: 'minimal', label: 'Minimal' },
          ]}
        />
      </div>

      <DataTable
        rowKey="id"
        variant={variant}
        size="sm"
        selectable
        data={[
          { id: '1', service: 'Auth-Gateway-Edge', owner: 'Ümit Uz', latency: '4.2 ms', status: 'Healthy' },
          { id: '2', service: 'SheetGL-Compute-Engine', owner: 'Deniz Kaya', latency: '8.1 ms', status: 'Healthy' },
          { id: '3', service: 'FileManGL-VFS-Sync', owner: 'Selin Yılmaz', latency: '11.4 ms', status: 'Scaling' },
        ]}
        columns={[
          { key: 'service', header: 'Servis Adı', sortable: true },
          { key: 'owner', header: 'Sorumlu', sortable: true },
          { key: 'latency', header: 'Gecikme', sortable: true },
          {
            key: 'status',
            header: 'Durum',
            align: 'right',
            render: (r) => (
              <Badge tone={r.status === 'Healthy' ? 'success' : 'warning'} size="xs">
                {String(r.status)}
              </Badge>
            ),
          },
        ]}
      />
      <Pagination
        page={page}
        totalPages={5}
        totalItems={48}
        pageSize={10}
        onPageChange={setPage}
      />
    </div>
  );
};

export const WebGLAuroraLiveMiniDemo: React.FC = () => {
  const { preferences, setWebglPreset } = useTheme();
  const preset = preferences.webglPreset ?? 'aurora-borealis';

  return (
    <div className="uxu-stack-sm">
      <SegmentedControl<WebGLShaderPreset>
        size="sm"
        value={preset}
        onChange={setWebglPreset}
        options={[
          { value: 'aurora-borealis', label: 'Aurora' },
          { value: 'spatial-nebula', label: 'Nebula' },
          { value: 'material-lava', label: 'Lava' },
          { value: 'cyber-horizon', label: 'Cyber' },
        ]}
      />
      <div
        style={{
          position: 'relative',
          height: 140,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--uxu-border-subtle)',
        }}
      >
        <WebGLAuroraCanvas />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--uxu-text-primary)',
            fontWeight: 700,
            fontSize: '0.88rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.45)',
          }}
        >
          WebGLAuroraCanvas • Preset: {preset}
        </div>
      </div>
    </div>
  );
};
