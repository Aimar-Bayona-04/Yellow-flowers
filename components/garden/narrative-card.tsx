"use client";

import { useState } from "react";
import type { GardenStation } from "@/lib/client/contracts";
import { ArrowIcon } from "@/components/ui/icons";

interface NarrativeCardProps {
  station: GardenStation;
  stationIndex: number;
  stationCount: number;
  onClose: () => void;
  onComplete: () => void;
}

export function NarrativeCard({
  station,
  stationIndex,
  stationCount,
  onClose,
  onComplete,
}: Readonly<NarrativeCardProps>) {
  const [page, setPage] = useState(0);
  const pageCount = 1 + station.letters.length + station.sections.length;
  const letter =
    page > 0 && page <= station.letters.length ? station.letters[page - 1] : null;
  const sectionIndex = page - station.letters.length - 1;
  const section = sectionIndex >= 0 ? station.sections[sectionIndex] ?? null : null;
  const isFinalPage = page === pageCount - 1;

  return (
    <article
      className={`narrative-card ${page > 0 ? "is-reading" : ""}`}
      aria-labelledby={`station-title-${station.id}`}
    >
      <button className="narrative-close" aria-label="Cerrar mensaje" onClick={onClose}>×</button>
      <div className="station-number">{String(stationIndex + 1).padStart(2, "0")}</div>

      {page === 0 && (
        <div className="narrative-page" key="opening">
          <span className="kicker">{station.eyebrow}</span>
          <h2 id={`station-title-${station.id}`}>{station.title}</h2>
          <p className="station-description">{station.description}</p>
          <blockquote>“{station.message}”</blockquote>
          <div className="flower-signature">
            <span aria-hidden="true">✿</span>
            <div><small>{station.flowerName}</small><strong>{station.flowerMeaning}</strong></div>
          </div>
        </div>
      )}

      {letter && (
        <div className="narrative-page station-letter" key={letter.title}>
          <span className="kicker">{letter.eyebrow}</span>
          <h2 id={`station-title-${station.id}`}>{letter.title}</h2>
          <div className="letter-rule"><span>✦</span></div>
          {letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="letter-signature">{letter.signature}</p>
        </div>
      )}

      {section && (
        <div className="narrative-page contemplation" key={section.title}>
          <span className="kicker">Pausa para sentir</span>
          <h2 id={`station-title-${station.id}`}>{section.title}</h2>
          <div className="letter-rule"><span>✦</span></div>
          <p>{section.body}</p>
          <p className="reflection">{section.prompt}</p>
          {isFinalPage && <p className="final-reflection">{station.reflection}</p>}
        </div>
      )}

      <div className="reading-progress" aria-label={`Página ${page + 1} de ${pageCount}`}>
        {Array.from({ length: pageCount }, (_, pageIndex) => (
          <i
            key={pageIndex}
            className={pageIndex === page ? "is-active" : pageIndex < page ? "is-read" : ""}
          />
        ))}
      </div>
      <div className="narrative-navigation">
        {page > 0 && (
          <button className="page-button is-back" onClick={() => setPage((current) => current - 1)}>
            ← Anterior
          </button>
        )}
        {!isFinalPage ? (
          <button className="page-button is-next" onClick={() => setPage((current) => current + 1)}>
            {page === 0 ? "Comenzar las cartas" : "Continuar"} <ArrowIcon />
          </button>
        ) : (
          <button className="page-button is-next" onClick={onComplete}>
            {station.actionLabel} <ArrowIcon />
          </button>
        )}
      </div>
      <small className="station-count">
        Momento {String(stationIndex + 1).padStart(2, "0")} de {String(stationCount).padStart(2, "0")}
        {" · "}Página {page + 1} de {pageCount}
      </small>
    </article>
  );
}
