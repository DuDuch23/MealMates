<?php

namespace App\Service;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

class ErrorService{

    private ?Collection $tab;

    public function __construct() {
        $this->tab = new ArrayCollection();
    }

    public function getErrors(): ?Collection
    {
        return $this->tab;
    }

    public function hasErrors(): bool
    {
        return !empty($this->errors);
    }

    public function addError($data): void
    {
        if (!$this->tab->contains($data)) {
            $this->tab->add($data);
        }
    }

    public function deleteError($data): void
    {
        if (!$this->tab->contains($data)) {
            $this->tab->removeElement($data);
        }
    }
}